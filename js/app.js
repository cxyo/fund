// 基金温度表应用

// 类别配置
const CATEGORIES = {
    'B': { name: '大盘', weight: 20, max_funds: 1, color: '#1a237e' },      // 深蓝
    'C': { name: '小盘', weight: 20, max_funds: 1, color: '#4a148c' },      // 深紫
    'D': { name: '策略', weight: 10, max_funds: 2, color: '#1a237e' },      // 深蓝
    'E': { name: '行业', weight: 10, max_funds: 2, color: '#4a148c' },      // 深紫
    'F': { name: '主题', weight: 10, max_funds: 2, color: '#1a237e' },      // 深蓝
    'G': { name: '海外', weight: 10, max_funds: 1, color: '#4a148c' },      // 深紫
    'H': { name: '债券', weight: 20, max_funds: 2, color: '#1a237e' },      // 深蓝
};

// 指数类别映射（完整配置）
const CATEGORY_MAP = {
    // B大盘
    '399006': 'B', '399550': 'B', '000010': 'B', '399330': 'B',
    '399001': 'B', '000300': 'B', '000016': 'B', '000903': 'B',
    
    // C小盘
    '399673': 'C', '399008': 'C', '000852': 'C', '000905': 'C', '000688': 'C',
    
    // D策略
    '399348': 'D', '399701': 'D', '000029': 'D', '399702': 'D',
    '399324': 'D', '000919': 'D', '000922': 'D', '930782': 'D',
    'H30089': 'D', '000925': 'D', '000821': 'D', 'H30269': 'D',
    '000015': 'D', '950090': 'D', '930740': 'D',
    
    // E行业
    '399807': 'E', '399396': 'E', '399995': 'E', '000932': 'E',
    '399987': 'E', '399393': 'E', '930697': 'E', '399812': 'E',
    'H30533': 'E', 'H11136': 'E', '000992': 'E', '399975': 'E',
    '399986': 'E', '000989': 'E', '931747': 'E', '399806': 'E',
    '399973': 'E', '931008': 'E', '000941': 'E', '399967': 'E',
    '399998': 'E', '000928': 'E', '980027': 'E', '399395': 'E',
    '000993': 'E', '000979': 'E', '931594': 'E',
    
    // F主题
    '930653': 'F', '399997': 'F', '399814': 'F', '399976': 'F',
    '399971': 'F', '931152': 'F', '000827': 'F', '931151': 'F',
    '931087': 'F', '990001': 'F', '980017': 'F', 'H30590': 'F',
    '931752': 'F', '931079': 'F', '931071': 'F',
    
    // G海外
    'HSCGSI': 'G', 'HSTECH': 'G', 'HSI': 'G', 'HSCEI': 'G',
    'HSCAIT': 'G', 'HSMSI': 'G', '.INX': 'G',
};

let fundsData = null;
let oldData = null;
let codeConfig = null;
let searchResults = [];
let selectedIndex = null;
let selectedCategory = null;

document.addEventListener('DOMContentLoaded', function() {
    updateDate();
    calculateAndShowStarRating();
    loadAllData();
});

// 加载所有数据
async function loadAllData() {
    try {
        // 显示加载中
        showLoading(true);
        
        // 并行加载 code.json、data.csv 和 old_data.csv
        const [codeRes, csvRes1, csvRes2] = await Promise.all([
            fetch('code.json'),
            fetch('data.csv'),
            fetch('old_data.csv')
        ]);
        
        if (!codeRes.ok) {
            throw new Error('code.json 加载失败');
        }
        codeConfig = await codeRes.json();
        
        if (!csvRes1.ok) {
            throw new Error('data.csv 加载失败');
        }
        const csvText1 = await csvRes1.text();
        fundsData = parseCSVFull(csvText1);
        
        if (!csvRes2.ok) {
            throw new Error('old_data.csv 加载失败');
        }
        const csvText2 = await csvRes2.text();
        oldData = parseCSVFull(csvText2);
        
        // 合并数据：将oldData的涨跌幅合并到fundsData
        for (const [code, data] of Object.entries(oldData)) {
            if (fundsData[code]) {
                fundsData[code].two_day_change_pct = data.change_pct;
            }
        }
        
        console.log('已加载', Object.keys(fundsData).length, '条指数数据');
        
        // 自动显示基金温度表格
        renderFundTable();
        
        showLoading(false);
        
    } catch (error) {
        console.error('加载数据失败:', error);
        showLoading(false);
    }
}

// 显示/隐藏加载中
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = show ? 'flex' : 'none';
    }
}

// 渲染基金温度表格
function renderFundTable() {
    const tbody = document.getElementById('fundTableBody');
    if (!tbody || !codeConfig || !fundsData) return;
    
    tbody.innerHTML = '';
    
    // 遍历所有类别的指数
    const categoryOrder = ['B', 'C', 'D', 'E', 'F', 'G'];
    
    for (const category of categoryOrder) {
        const codes = codeConfig[category];
        if (!codes) continue;
        
        for (const code of codes) {
            const data = fundsData[code];
            if (!data) continue;
            
            const categoryInfo = CATEGORIES[category];
            
            // 计算温度
            let temperature;
            if (category === 'E') {
                // 行业类：温度 = PB分位点 × 100
                temperature = data.pb_percentile * 100;
            } else {
                // 其他类：温度 = (PE分位点 + PB分位点) / 2 × 100
                temperature = (data.pe_percentile + data.pb_percentile) / 2 * 100;
            }
            
            // 温度颜色：高温绿色，正常黄色，低温红色
            let tempColor;
            if (temperature >= 50) {
                tempColor = '#51cf66'; // 高温绿色
            } else if (temperature >= 30) {
                tempColor = '#fcc419'; // 正常黄色
            } else {
                tempColor = '#ff6b6b'; // 低温红色
            }
            
            // 格式化涨跌幅
            const yearChangeHtml = formatChange(data.year_change_pct);
            const changeHtml = formatChange(data.change_pct);
            const twoDayChangeHtml = data.two_day_change_pct !== undefined 
                ? formatChange(data.two_day_change_pct) 
                : '<span style="color: rgba(255,255,255,0.5);">--</span>';
            
            // 关注度
            const attentionHtml = formatAttention(data.attention);
            
            // 创建表格行
            const row = document.createElement('tr');
            row.style.backgroundColor = categoryInfo.color;
            row.innerHTML = `
                <td>${categoryInfo.name}</td>
                <td>${code}</td>
                <td>${data.name}</td>
                <td class="temperature-cell">
                    <span class="temp-value" style="color: ${tempColor}; font-weight: bold;">${temperature.toFixed(2)}°C</span>
                </td>
                <td>${yearChangeHtml}</td>
                <td>${changeHtml}</td>
                <td>${twoDayChangeHtml}</td>
                <td>${attentionHtml}</td>
            `;
            
            tbody.appendChild(row);
        }
    }
    
    console.log('已渲染基金温度表格');
}

// 格式化涨跌幅
function formatChange(value) {
    if (value > 0) {
        return `<span style="color: #ff6b6b;">+${value.toFixed(2)}%</span>`;
    } else if (value < 0) {
        return `<span style="color: #51cf66;">${value.toFixed(2)}%</span>`;
    }
    return '<span style="color: rgba(255,255,255,0.5);">0.00%</span>';
}

// 格式化关注度
function formatAttention(value) {
    if (!value) return '--';
    const numValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (!isNaN(numValue) && numValue > 10000) {
        return `<span style="color: #ff6b6b;">${value}</span>`;
    }
    return value;
}

// 完整解析CSV数据
function parseCSVFull(csvText) {
    const lines = csvText.trim().split('\n');
    const data = {};
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length >= 15) {
            const code = values[0].replace(/^=/, '').replace(/"/g, '').trim();
            
            function getFloat(colIdx) {
                if (colIdx < values.length && values[colIdx]) {
                    try {
                        const val = values[colIdx].replace(/^=/, '').replace(/"/g, '').trim();
                        return parseFloat(val) || 0;
                    } catch (e) {
                        return 0;
                    }
                }
                return 0;
            }
            
            function getString(colIdx) {
                if (colIdx < values.length && values[colIdx]) {
                    return values[colIdx].replace(/^=/, '').replace(/"/g, '').trim();
                }
                return '';
            }
            
            data[code] = {
                name: values[1] ? values[1].replace(/^=/, '').replace(/"/g, '').trim() : '',
                change_pct: getFloat(3) * 100,
                year_change_pct: getFloat(5) * 100,
                pe: getFloat(6),
                pb: getFloat(13),
                pe_percentile: getFloat(7),
                pb_percentile: getFloat(14),
                attention: getString(31),
            };
        }
    }
    
    return data;
}

// 搜索指数
function searchIndex() {
    const keyword = document.getElementById('searchKeyword').value.trim();
    if (!keyword) {
        alert('请输入指数代码或名称');
        return;
    }
    
    if (!fundsData) {
        alert('数据加载中，请稍候...');
        return;
    }
    
    const keywordLower = keyword.toLowerCase();
    searchResults = [];
    
    for (const [code, data] of Object.entries(fundsData)) {
        if (code.toLowerCase().includes(keywordLower) || 
            data.name.toLowerCase().includes(keywordLower)) {
            searchResults.push({ code, name: data.name });
        }
    }
    
    // 隐藏之前的结果
    document.getElementById('categorySelect').style.display = 'none';
    
    if (searchResults.length === 0) {
        document.getElementById('searchResults').style.display = 'block';
        document.getElementById('resultsList').innerHTML = '<p style="color: #ff6b6b;">未找到匹配的指数</p>';
        return;
    }
    
    // 显示搜索结果
    document.getElementById('searchResults').style.display = 'block';
    
    if (searchResults.length === 1) {
        // 只有一个结果，直接选择
        selectIndex(0);
    } else {
        // 显示多个结果供选择
        const resultsHtml = searchResults.slice(0, 20).map((r, idx) => 
            `<div class="result-item" onclick="selectIndex(${idx})">${r.code} - ${r.name}</div>`
        ).join('');
        
        const moreText = searchResults.length > 20 ? 
            `<p style="color: rgba(255,255,255,0.5); margin-top: 10px;">... 还有 ${searchResults.length - 20} 个结果</p>` : '';
        
        document.getElementById('resultsList').innerHTML = 
            `<p>找到 ${searchResults.length} 个匹配结果：</p>${resultsHtml}${moreText}`;
    }
}

// 选择指数
function selectIndex(idx) {
    selectedIndex = searchResults[idx];
    selectedCategory = null; // 重置类别选择
    
    // 重置类别按钮高亮
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // 显示已选择的指数
    document.getElementById('searchResults').style.display = 'none';
    document.getElementById('categorySelect').style.display = 'block';
}

// 重置搜索区域
function resetSearchArea() {
    selectedIndex = null;
    selectedCategory = null;
    document.getElementById('searchKeyword').value = '';
    document.getElementById('searchResults').style.display = 'none';
    document.getElementById('categorySelect').style.display = 'none';
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
}

// 选择类别
function selectCategory(categoryCode) {
    selectedCategory = categoryCode;
    
    // 高亮选中的类别按钮
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.category === categoryCode) {
            btn.classList.add('selected');
        }
    });
}

// 回车键搜索
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchKeyword');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchIndex();
            }
        });
    }
});

// 计算并显示温度星级
async function calculateAndShowStarRating() {
    try {
        const response = await fetch('data.csv');
        if (!response.ok) {
            throw new Error('数据加载失败');
        }
        const csvText = await response.text();
        const data = parseCSV(csvText);
        
        // 找到中证全指(000985)
        const row = data.find(r => {
            const code = (r['指数代码'] || '').toString().replace(/^=/, '');
            return code.includes('000985');
        });
        
        if (!row) {
            console.warn('未找到中证全指数据');
            return;
        }
        
        // 获取PE和PB分位点
        let pe = row['PE-TTM(分位点%)'];
        let pb = row['PB(分位点%)'];
        
        if (typeof pe === 'string') pe = parseFloat(pe.replace(/^=/, '')) * 100;
        else if (pe !== undefined) pe = parseFloat(pe) * 100;
        else pe = 0;
        
        if (typeof pb === 'string') pb = parseFloat(pb.replace(/^=/, '')) * 100;
        else if (pb !== undefined) pb = parseFloat(pb) * 100;
        else pb = 0;
        
        // 计算温度星级
        const starRating = (pe * 0.29 + pb * 0.71) / 16.73;
        updateStarDisplay(starRating);
        
    } catch (error) {
        console.error('计算温度星级失败:', error);
    }
}

// 更新星级显示
function updateStarDisplay(starRating) {
    const avgStar = document.getElementById('avgStar');
    const starValue = document.getElementById('starValue');
    
    if (avgStar) {
        const stars = Math.round(starRating);
        const clamped = Math.max(0, Math.min(5, stars));
        avgStar.textContent = '★'.repeat(clamped) + '☆'.repeat(5 - clamped);
        avgStar.style.color = '#ff4444';
    }
    
    if (starValue) {
        starValue.textContent = starRating.toFixed(2);
        starValue.style.color = '#ff4444';
    }
}

// 解析CSV数据
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length >= 12) {
            const row = {};
            headers.forEach((h, idx) => {
                row[h.trim()] = values[idx] ? values[idx].trim() : '';
            });
            data.push(row);
        }
    }
    
    return data;
}

// 更新日期显示
function updateDate() {
    const dateEl = document.getElementById('dataDate');
    if (dateEl) {
        const today = new Date();
        dateEl.textContent = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    }
}