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
        
        // 从服务器加载CSV文件
        if (!csvRes1.ok) {
            throw new Error('data.csv 加载失败');
        }
        const csvText1 = await csvRes1.text();
        fundsData = parseCSVFull(csvText1);
        
        if (!csvRes2.ok) {
            throw new Error('old_data.csv 加载失败');
        }
        const csvText2 = await csvRes2.text();
        oldData = parseOldCSVFull(csvText2);
        
        // 优先从localStorage加载用户上传的数据
        const localCsvData = localStorage.getItem('csvData');
        if (localCsvData) {
            fundsData = parseCSVFull(localCsvData);
        }
        
        const localOldData = localStorage.getItem('oldData');
        if (localOldData) {
            oldData = parseOldCSVFull(localOldData);
        }
        
        // 合并数据：将oldData的上两日涨跌幅合并到fundsData
        for (const [code, data] of Object.entries(oldData)) {
            if (fundsData[code]) {
                fundsData[code].two_day_change_pct = data.change_pct;
            }
        }
        
        // 合并自定义配置到codeConfig（如果有的话）
        let customConfigStr = localStorage.getItem('customCodeConfig');
        if (customConfigStr) {
            try {
                const customConfig = JSON.parse(customConfigStr);
                // 合并自定义配置
                for (const [category, codes] of Object.entries(customConfig)) {
                    if (codeConfig[category]) {
                        // 合并数组，去除重复
                        const existingCodes = new Set(codeConfig[category]);
                        for (const code of codes) {
                            if (!existingCodes.has(code)) {
                                codeConfig[category].push(code);
                            }
                        }
                    } else {
                        codeConfig[category] = codes;
                    }
                }
            } catch (e) {
                // 合并自定义配置失败，忽略
            }
        }
        
        // 自动显示基金温度表格
        renderFundTable();
        
        showLoading(false);
        
    } catch (error) {
        // 加载数据失败
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
    if (!tbody) return;
    
    // 检查数据是否加载
    if (!codeConfig || !fundsData) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">数据加载中...</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    
    // 每个类别需要选出的数量
    const categorySelectionCount = {
        'B': 1, // 大盘选1个
        'C': 1, // 小盘选1个
        'D': 2, // 策略选2个
        'E': 2, // 行业选2个
        'F': 2, // 主题选2个
        'G': 1, // 海外选1个
        'H': 2  // 债券选2个
    };
    
    // 收集每个类别的数据并计算温度
    const categoryDataMap = {};
    const missingCodes = []; // 记录缺失的代码
    const matchedCodes = []; // 记录匹配的代码
    
    for (const category of Object.keys(codeConfig)) {
        const codes = codeConfig[category];
        if (!codes || codes.length === 0) continue;
        
        categoryDataMap[category] = [];
        
        for (const code of codes) {
            const data = fundsData[code];
            if (!data) {
                // 记录缺失的代码
                if (!missingCodes.includes(code)) {
                    missingCodes.push(code);
                }
                continue;
            }
            
            // 记录匹配的代码
            if (!matchedCodes.includes(code)) {
                matchedCodes.push(code);
            }
            
            // 计算温度
            let temperature;
            if (category === 'E') {
                // 行业类：温度 = PB分位点 × 100
                temperature = data.pb_percentile * 100;
            } else {
                // 其他类：温度 = (PE分位点 + PB分位点) / 2 × 100
                temperature = (data.pe_percentile + data.pb_percentile) / 2 * 100;
            }
            
            // 解析关注度数值用于排序
            let attentionValue = 0;
            if (data.attention) {
                attentionValue = parseFloat(data.attention.replace(/[^0-9.]/g, '')) || 0;
            }
            
            categoryDataMap[category].push({
                category,
                code,
                data,
                temperature,
                attentionValue
            });
        }
        
        // 每个类别内按温度升序排序（温度最低的排前面）
        categoryDataMap[category].sort((a, b) => {
            if (Math.abs(a.temperature - b.temperature) > 0.01) {
                return a.temperature - b.temperature;
            }
            // 温度相同则按关注度降序
            return b.attentionValue - a.attentionValue;
        });
    }
    
    // 收集最终要显示的数据
    const finalData = [];
    const processedCategories = new Set();
    
    // 首先添加每个类别选出的top数据（总数11个）
    for (const category of ['B', 'C', 'D', 'E', 'F', 'G', 'H']) {
        const selectionCount = categorySelectionCount[category] || 1;
        const categoryData = categoryDataMap[category];
        
        if (categoryData && categoryData.length > 0) {
            // 选出指定数量的数据
            const selectedCount = Math.min(selectionCount, categoryData.length);
            for (let i = 0; i < selectedCount; i++) {
                finalData.push({
                    ...categoryData[i],
                    isTopSelection: true  // 标记为精选
                });
            }
            processedCategories.add(category);
        }
    }
    
    // 然后添加其余数据
    for (const category of Object.keys(categoryDataMap)) {
        const categoryData = categoryDataMap[category];
        const selectionCount = categorySelectionCount[category] || 1;
        
        if (categoryData && categoryData.length > selectionCount) {
            for (let i = selectionCount; i < categoryData.length; i++) {
                finalData.push({
                    ...categoryData[i],
                    isTopSelection: false
                });
            }
        }
    }
    
    // 渲染表格
    let displayedCount = 0;
    
    for (const item of finalData) {
        const { category, code, data, temperature, isTopSelection } = item;
        const categoryInfo = CATEGORIES[category];
        
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
        
        // 为精选数据添加特殊标记 - 使用边框和背景色区分
        if (isTopSelection) {
            row.style.cssText = `
                background: linear-gradient(90deg, rgba(255,215,0,0.15) 0%, ${categoryInfo.color} 50%, rgba(255,215,0,0.15) 100%);
                border: 3px solid #FFD700;
                box-shadow: 0 0 10px rgba(255,215,0,0.5);
            `;
            row.innerHTML = `
                <td>${categoryInfo.name} ⭐</td>
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
        } else {
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
        }
        
        tbody.appendChild(row);
        displayedCount++;
    }
    
    // 如果没有显示任何数据，显示提示
    if (displayedCount === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">没有找到匹配的指数数据，请检查CSV数据是否包含有效代码</td></tr>';
    }
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
// 处理Excel格式的CSV值（处理="代码"格式）
function parseValue(val) {
    if (!val) return '';
    // 处理Excel格式：="12345" -> 12345
    val = val.trim();
    if (val.startsWith('="') && val.endsWith('"')) {
        val = val.slice(2, -1);
    } else if (val.startsWith('=')) {
        // 处理 =12345 或 ="12345" 格式
        val = val.slice(1).replace(/^"|"$/g, '');
    }
    // 去除所有残留引号
    val = val.replace(/"/g, '');
    return val;
}

// 处理数值
function parseNumber(val) {
    if (!val) return 0;
    val = parseValue(val);
    // 移除百分号
    val = val.replace(/%$/, '');
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
}

// 处理涨跌幅（带百分号，需要乘以100）
function parsePercent(val) {
    if (!val) return 0;
    val = parseValue(val);
    // 移除百分号
    val = val.replace(/%$/, '');
    const num = parseFloat(val);
    // 乘以100，例如 0.5% -> 0.5, 1.23% -> 1.23
    return isNaN(num) ? 0 : num * 100;
}

function parseCSVFull(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return {};
    
    // 解析表头，支持中英文列名
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    
    // 创建列名映射
    const colMap = {};
    headers.forEach((h, idx) => {
        const hLower = h.toLowerCase();
        if (h === '指数代码' || hLower === 'code') colMap.code = idx;
        else if (h === '指数名称' || hLower === 'name') colMap.name = idx;
        else if (h === '今日涨跌幅' || hLower === 'change_pct' || h === '涨跌幅' || h === '上一日涨跌') colMap.change_pct = idx;
        else if (h === '今年涨跌幅' || hLower === 'year_change_pct' || h === '今年涨幅' || h === '今年涨跌' || h === '今年以来涨跌幅') colMap.year_change_pct = idx;
        else if (h === '上两日涨跌') colMap.two_day_change_pct = idx;
        else if (h === 'PE-TTM(当前值)' || hLower === 'pe') colMap.pe = idx;
        else if (h === 'PB' || hLower === 'pb') colMap.pb = idx;
        else if (h === 'PE-TTM(分位点%)' || hLower === 'pe_percentile') colMap.pe_percentile = idx;
        else if (h === 'PB(分位点%)' || hLower === 'pb_percentile') colMap.pb_percentile = idx;
        else if (h === '关注度' || hLower === 'attention') colMap.attention = idx;
    });
    
    const data = {};
    
    for (let i = 1; i < lines.length; i++) {
        // 处理CSV行，可能包含引号内的逗号
        const values = [];
        let currentVal = '';
        let inQuotes = false;
        
        for (let j = 0; j < lines[i].length; j++) {
            const char = lines[i][j];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(currentVal);
                currentVal = '';
            } else {
                currentVal += char;
            }
        }
        values.push(currentVal);
        
        // 去除每个值两端的引号（如果有）
        for (let k = 0; k < values.length; k++) {
            values[k] = values[k].replace(/^"|"$/g, '');
        }
        
        // 确保有code列
        if (colMap.code === undefined || colMap.code >= values.length) continue;
        const rawCode = values[colMap.code];
        const code = parseValue(rawCode);
        
        // 跳过无效代码
        if (!code || code.length < 2) continue;
        
        // 解析并存储数据
        const itemData = {
            name: parseValue(values[colMap.name]) || '',
            change_pct: parsePercent(values[colMap.change_pct]),
            year_change_pct: parsePercent(values[colMap.year_change_pct]),
            two_day_change_pct: parsePercent(values[colMap.two_day_change_pct]),
            pe: parseNumber(values[colMap.pe]),
            pb: parseNumber(values[colMap.pb]),
            pe_percentile: parseNumber(values[colMap.pe_percentile]),
            pb_percentile: parseNumber(values[colMap.pb_percentile]),
            attention: parseValue(values[colMap.attention]) || '',
        };
        
        data[code] = itemData;
    }
    
    return data;
}

// 解析old_data.csv获取上两日涨跌数据
function parseOldCSVFull(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return {};
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    
    const colMap = {};
    headers.forEach((h, idx) => {
        const hLower = h.toLowerCase();
        if (h === '指数代码' || hLower === 'code') colMap.code = idx;
        else if (h === '今日涨跌幅' || hLower === 'change_pct' || h === '涨跌幅') colMap.change_pct = idx;
    });
    
    const data = {};
    
    for (let i = 1; i < lines.length; i++) {
        // 处理CSV行，可能包含引号内的逗号
        const values = [];
        let currentVal = '';
        let inQuotes = false;
        
        for (let j = 0; j < lines[i].length; j++) {
            const char = lines[i][j];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(currentVal);
                currentVal = '';
            } else {
                currentVal += char;
            }
        }
        values.push(currentVal);
        
        // 去除每个值两端的引号（如果有）
        for (let k = 0; k < values.length; k++) {
            values[k] = values[k].replace(/^"|"$/g, '');
        }
        
        if (colMap.code === undefined || colMap.code >= values.length) continue;
        
        const code = parseValue(values[colMap.code]);
        if (!code || code.length < 2) continue;
        
        const changePctValue = colMap.change_pct !== undefined ? values[colMap.change_pct] : undefined;
        
        data[code] = {
            change_pct: parsePercent(changePctValue),
        };
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
        // 计算温度星级失败，忽略
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

// 添加指数到基金温度表
function addToFundTable() {
    if (!selectedIndex) {
        alert('请先搜索并选择一个指数');
        return;
    }
    
    if (!selectedCategory) {
        alert('请选择一个类别');
        return;
    }
    
    const code = selectedIndex.code;
    const category = selectedCategory;
    
    // 获取当前自定义配置
    let customConfigStr = localStorage.getItem('customCodeConfig');
    let customConfig = customConfigStr ? JSON.parse(customConfigStr) : {};
    
    // 初始化类别数组
    if (!customConfig[category]) {
        customConfig[category] = [];
    }
    
    // 检查是否已存在
    if (customConfig[category].includes(code)) {
        alert('该指数已经添加到基金温度表了');
        return;
    }
    
    // 添加到配置
    customConfig[category].push(code);
    
    // 保存到localStorage
    localStorage.setItem('customCodeConfig', JSON.stringify(customConfig));
    
    // 重新加载数据并渲染
    loadAllData();
    
    // 重置搜索区域
    resetSearchArea();
    
    alert('添加成功！指数已添加到基金温度表。\n\n💡 提示：为了永久保存配置，请点击页面底部的"导出配置"按钮，将配置文件下载后替换项目中的 code.json 文件。');
}

// 导出自定义配置
function exportCustomConfig() {
    // 从codeConfig导出当前显示的指数配置
    const exportData = {};
    
    for (const [key, value] of Object.entries(codeConfig)) {
        // 只导出有内容的类别
        if (Array.isArray(value) && value.length > 0) {
            exportData[key] = value;
        }
    }
    
    if (Object.keys(exportData).length === 0) {
        showNotification('暂无配置可导出', 'warning');
        return;
    }
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jj-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('配置已导出为 jj-config.json', 'success');
}

// 导入自定义配置
function importCustomConfig(input) {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedConfig = JSON.parse(e.target.result);
            
            // 验证配置格式
            if (typeof importedConfig !== 'object' || importedConfig === null) {
                throw new Error('配置格式错误');
            }
            
            // 验证并清理配置
            const cleanedConfig = {};
            const missingCodes = []; // 记录CSV中不存在的代码
            
            for (const [key, value] of Object.entries(importedConfig)) {
                if (Array.isArray(value)) {
                    cleanedConfig[key] = value.filter(code => {
                        if (typeof code === 'string' && code.trim() !== '') {
                            // 检查code是否存在于当前数据中
                            if (!fundsData || !fundsData[code]) {
                                missingCodes.push(code);
                            }
                            return true;
                        }
                        return false;
                    });
                }
            }
            
            if (Object.keys(cleanedConfig).length === 0) {
                throw new Error('配置中未找到有效的指数代码');
            }
            
            // 检查是否有缺失的代码
            if (missingCodes.length > 0) {
                showNotification(`警告：以下指数在数据中不存在：${missingCodes.join(', ')}`, 'warning');
            }
            
            // 保存到localStorage
            localStorage.setItem('customCodeConfig', JSON.stringify(cleanedConfig));

            // 完全替换codeConfig为导入的配置（而非合并）
            codeConfig = JSON.parse(JSON.stringify(cleanedConfig));

            // 重新加载CSV数据并渲染表格
            loadAllData();

            // 显示导入结果统计
            const totalCount = Object.values(cleanedConfig).reduce((sum, arr) => sum + arr.length, 0);
            showNotification(`配置导入成功！共${Object.keys(cleanedConfig).length}个类别，${totalCount}个指数。`, 'success');
            
        } catch (error) {
            showNotification('导入失败：' + error.message, 'error');
        }
        // 清空input，允许再次导入同一文件
        input.value = '';
    };
    reader.readAsText(file);
}

// 清除自定义配置
function clearCustomConfig() {
    // 清除localStorage中的配置
    localStorage.removeItem('customCodeConfig');
    localStorage.removeItem('csvData');
    localStorage.removeItem('oldData');
    
    codeConfig = {};
    fundsData = {};
    
    renderFundTable();
    showNotification('已清除所有配置，表格已清空', 'success');
}

// 通知提示函数
function showNotification(message, type = 'info') {
    const overlay = document.getElementById('loadingOverlay');
    const messageEl = overlay.querySelector('p');
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-size: 14px;
        z-index: 2000;
        animation: slideIn 0.3s ease;
        ${type === 'success' ? 'background: #28a745;' : ''}
        ${type === 'error' ? 'background: #dc3545;' : ''}
        ${type === 'warning' ? 'background: #ffc107; color: #333;' : ''}
        ${type === 'info' ? 'background: #17a2b8;' : ''}
    `;
    
    // 添加动画样式
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // 3秒后自动消失
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 清理Excel格式的CSV数据
// Excel导出的CSV中，数字会被格式化为 ="值"，需要清理为纯值
function cleanExcelFormat(csvText) {
    // 使用正则表达式匹配Excel格式的值：="内容"
    // 匹配模式：="任意内容"，但排除已经处理过的纯数字
    const cleanedLines = csvText.split('\n').map((line, lineIndex) => {
        // 对于第一行（表头），也进行清理
        const values = [];
        let currentVal = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                // 清理每个值
                values.push(cleanValue(currentVal));
                currentVal = '';
            } else {
                currentVal += char;
            }
        }
        // 添加最后一个值
        values.push(cleanValue(currentVal));
        
        return values.join(',');
    });
    
    return cleanedLines.join('\n');
}

// 清理单个值中的Excel格式
function cleanValue(val) {
    if (!val) return val;
    
    val = val.trim();
    
    // 处理Excel格式：="值" -> 值
    // 包括以下模式：
    // 1. ="12345" -> 12345
    // 2. ="H11146" -> H11146
    // 3. =-0.0016 -> -0.0016 (数值格式)
    // 4. =12671.2400 -> 12671.2400 (数值格式)
    
    // 匹配 ="xxx" 格式
    if (val.startsWith('="') && val.endsWith('"')) {
        // 去掉 =" 和 "，保留内部内容
        return val.slice(2, -1);
    }
    
    // 匹配 =数值 格式（如 =-0.0016 或 =12671.2400）
    if (val.startsWith('=') && val.length > 1) {
        // 去掉等号，保留数值
        return val.slice(1);
    }
    
    // 移除开头和结尾的引号
    val = val.replace(/^"|"$/g, '');
    
    return val;
}

// 处理data.csv文件上传
function handleCSVUpload(input) {
    const file = input.files[0];
    if (!file) return;
    
    document.getElementById('csvFileName').textContent = file.name;
    const statusEl = document.getElementById('csvUploadStatus');
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            let csvText = e.target.result;
            csvText = cleanExcelFormat(csvText);
            
            const lines = csvText.trim().split('\n');
            if (lines.length < 2) {
                throw new Error('CSV文件内容为空或格式不正确');
            }
            
            const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
            const hasCodeCol = headers.some(h => h.toLowerCase() === 'code' || h === '指数代码');
            const hasNameCol = headers.some(h => h.toLowerCase() === 'name' || h === '指数名称');
            
            if (!hasCodeCol) {
                throw new Error('CSV文件缺少必要的列：code/指数代码');
            }
            if (!hasNameCol) {
                throw new Error('CSV文件缺少必要的列：name/指数名称');
            }
            
            localStorage.setItem('csvData', csvText);
            fundsData = parseCSVFull(csvText);
            
            const blob = new Blob([csvText], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = 'data.csv';
            
            renderFundTable();
            
            showNotification(`data.csv 已加载！正在下载...`, 'info');
            
            setTimeout(() => {
                downloadLink.click();
                URL.revokeObjectURL(url);
            }, 500);
            
            statusEl.innerHTML = `<span style="color: #51cf66;">✅ data.csv 上传成功，已自动下载</span>`;
        } catch (error) {
            statusEl.innerHTML = `<span style="color: #ff6b6b;">❌ 上传失败：${error.message}</span>`;
            showNotification('上传失败：' + error.message, 'error');
        }
        input.value = '';
        document.getElementById('csvFileName').textContent = '未选择文件';
    };
    reader.readAsText(file);
}

// 处理old_data.csv文件上传
function handleOldCSVUpload(input) {
    const file = input.files[0];
    if (!file) return;
    
    document.getElementById('oldCsvFileName').textContent = file.name;
    const statusEl = document.getElementById('csvUploadStatus');
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            let csvText = e.target.result;
            csvText = cleanExcelFormat(csvText);
            
            const lines = csvText.trim().split('\n');
            if (lines.length < 2) {
                throw new Error('CSV文件内容为空或格式不正确');
            }
            
            oldData = parseOldCSVFull(csvText);
            localStorage.setItem('oldData', csvText);
            
            let mergeCount = 0;
            if (fundsData) {
                for (const [code, data] of Object.entries(oldData)) {
                    if (fundsData[code]) {
                        fundsData[code].two_day_change_pct = data.change_pct;
                        mergeCount++;
                    }
                }
                renderFundTable();
            }
            
            const blob = new Blob([csvText], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = 'old_data.csv';
            
            showNotification(`old_data.csv 已加载（${mergeCount}条数据）！正在下载...`, 'info');
            
            setTimeout(() => {
                downloadLink.click();
                URL.revokeObjectURL(url);
            }, 500);
            
            statusEl.innerHTML = `<span style="color: #a855f7;">✅ old_data.csv 上传成功（${mergeCount}条），已自动下载</span>`;
        } catch (error) {
            statusEl.innerHTML = `<span style="color: #ff6b6b;">❌ 上传失败：${error.message}</span>`;
            showNotification('上传失败：' + error.message, 'error');
        }
        input.value = '';
        document.getElementById('oldCsvFileName').textContent = '未选择文件';
    };
    reader.readAsText(file);
}