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
    '399673': 'C', '399008': 'C', '000852': 'C', '000905': 'C', '000688': 'C', '399303': 'C',
    
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
    '931752': 'F', '931079': 'F', '931071': 'F', '930598': 'F',
    
    // G海外
    'HSCGSI': 'G', 'HSTECH': 'G', 'HSI': 'G', 'HSCEI': 'G',
    'HSCAIT': 'G', 'HSMSI': 'G', '.INX': 'G',
};

// 指数代码与场内/场外基金映射表
const FUND_CODES_MAP = {
    '399550': {场内代码: '159965', 场外代码: '217027'},
    '399006': {场内代码: '159952', 场外代码: '001593'},
    '000010': {场内代码: '510180', 场外代码: '519180'},
    '399330': {场内代码: '159901', 场外代码: '110019'},
    '399001': {场内代码: '159903', 场外代码: '006262'},
    '000300': {场内代码: '510310', 场外代码: '007339'},
    '000016': {场内代码: '510850', 场外代码: '007380'},
    '000903': {场内代码: '512910', 场外代码: '240014'},
    '399673': {场内代码: '159949', 场外代码: '160422'},
    '399008': {场内代码: '159907', 场外代码: '270026'},
    '000852': {场内代码: '512100', 场外代码: '017038'},
    '000905': {场内代码: '159922', 场外代码: '070039'},
    '000688': {场内代码: '588000', 场外代码: '011609'},
    '399303': {场内代码: '159628', 场外代码: '017548'},
    '399701': {场内代码: '159916', 场外代码: '530015'},
    '399348': {场内代码: '159913', 场外代码: '519706'},
    '000029': {场内代码: '510030', 场外代码: '240016'},
    '399324': {场内代码: '159905', 场外代码: '481012'},
    '399702': {场内代码: '159910', 场外代码: '070023'},
    'H30089': {场内代码: '515570', 场外代码: '007671'},
    '930782': {场内代码: '512260', 场外代码: '003318'},
    '000922': {场内代码: '515180', 场外代码: '100032'},
    '000919': {场内代码: '562320', 场外代码: '519671'},
    '000925': {场内代码: '512750', 场外代码: '160716'},
    'H30269': {场内代码: '512890', 场外代码: '005561'},
    '000821': {场内代码: '512530', 场外代码: '012713'},
    '000015': {场内代码: '510880', 场外代码: '016441'},
    '950090': {场内代码: '501050', 场外代码: '501050'},
    '930740': {场内代码: '159963', 场外代码: '007605'},
    '399807': {场内代码: '160135', 场外代码: '160135'},
    '399396': {场内代码: '159843', 场外代码: '160222'},
    '399995': {场内代码: '165525', 场外代码: '165525'},
    '000932': {场内代码: '159928', 场外代码: '000248'},
    '399987': {场内代码: '512690', 场外代码: '160632'},
    '399393': {场内代码: '160218', 场外代码: '160218'},
    '399812': {场内代码: '-', 场外代码: '000968'},
    '930697': {场内代码: '159996', 场外代码: '005063'},
    'H30533': {场内代码: '513050', 场外代码: '006327'},
    'H11136': {场内代码: '164906', 场外代码: '164906'},
    '000992': {场内代码: '159940', 场外代码: '001469'},
    '399975': {场内代码: '512000', 场外代码: '004070'},
    '399986': {场内代码: '512800', 场外代码: '001594'},
    '931747': {场内代码: '-', 场外代码: '-'},
    '000989': {场内代码: '159936', 场外代码: '001133'},
    '399806': {场内代码: '164908', 场外代码: '164908'},
    '399973': {场内代码: '512670', 场外代码: '012041'},
    '000941': {场内代码: '516160', 场外代码: '012831'},
    '931008': {场内代码: '159512', 场外代码: '004854'},
    '399998': {场内代码: '013275', 场外代码: '161032'},
    '399967': {场内代码: '512660', 场外代码: '002199'},
    '980027': {场内代码: '159566', 场外代码: '-'},
    '000928': {场内代码: '159930', 场外代码: '-'},
    '399395': {场内代码: '160221', 场外代码: '160221'},
    '000993': {场内代码: '159939', 场外代码: '000942'},
    '000979': {场内代码: '161715', 场外代码: '161715'},
    '931594': {场内代码: '512630', 场外代码: '024749'},
    '930653': {场内代码: '159736', 场外代码: '001632'},
    '399997': {场内代码: '161725', 场外代码: '161725'},
    '399814': {场内代码: '516550', 场外代码: '019280'},
    '399976': {场内代码: '515030', 场外代码: '161028'},
    '399971': {场内代码: '512980', 场外代码: '004752'},
    '931152': {场内代码: '159992', 场外代码: '012738'},
    '000827': {场内代码: '512580', 场外代码: '001064'},
    '931151': {场内代码: '515790', 场外代码: '011102'},
    '931087': {场内代码: '515000', 场外代码: '007873'},
    '990001': {场内代码: '512760', 场外代码: '008281'},
    '980017': {场内代码: '159995', 场外代码: '008888'},
    '931752': {场内代码: '560280', 场外代码: '020904'},
    'H30590': {场内代码: '562500', 场外代码: '014881'},
    '931079': {场内代码: '515050', 场外代码: '008087'},
    '931071': {场内代码: '515980', 场外代码: '008021'},
    '930598': {场内代码: '516150', 场外代码: '014332'},
    'HSCGSI': {场内代码: '159699', 场外代码: '023242'},
    'HSTECH': {场内代码: '513500', 场外代码: '050025'},
    'HSI': {场内代码: '159920', 场外代码: '164705'},
    'HSCEI': {场内代码: '510900', 场外代码: '110031'},
    'HSMSI': {场内代码: '160922', 场外代码: '160922'},
    'HSCAIT': {场内代码: '-', 场外代码: '540012'},
    '.INX': {场内代码: '513500', 场外代码: '050025'}
};

// 全局变量
let fundsData = null;
let oldData = null;
let codeConfig = null;
let searchResults = [];
let selectedIndex = null;
let selectedCategory = null;

// 缓存相关设置
const CACHE_EXPIRE_TIME = 24 * 60 * 60 * 1000; // 缓存过期时间：24小时
let fundNavCache = {}; // 基金净值数据缓存
let fundTempCache = {}; // 基金温度数据缓存



// 初始化缓存（从localStorage加载）
function initCache() {
    try {
        // 加载基金净值缓存
        const navCacheStr = localStorage.getItem('fundNavCache');
        if (navCacheStr) {
            fundNavCache = JSON.parse(navCacheStr);
        }
        
        // 加载基金温度缓存
        const tempCacheStr = localStorage.getItem('fundTempCache');
        if (tempCacheStr) {
            fundTempCache = JSON.parse(tempCacheStr);
        }
    } catch (error) {
        fundNavCache = {};
        fundTempCache = {};
    }
}

// 保存缓存到localStorage
function saveCache() {
    try {
        localStorage.setItem('fundNavCache', JSON.stringify(fundNavCache));
        localStorage.setItem('fundTempCache', JSON.stringify(fundTempCache));
    } catch (error) {
        console.error('[基金温度] 保存缓存失败:', error.message);
    }
}

// 图表状态变量，用于存储当前图表的信息
let currentChartState = {
    type: null,  // 'temperature' 或 'nav'
    code: null,   // 指数代码或基金代码
    name: null,   // 指数名称或基金名称
    fundType: null, // 场内或场外，仅对净值图表有效
    days: 365      // 当前显示天数，默认365天
};

// 初始化缓存
document.addEventListener('DOMContentLoaded', function() {
    initCache();
});

// 更新日期显示
function updateDate(dateStr) {
    const dateElement = document.getElementById('dataDate');
    if (dateElement) {
        dateElement.textContent = dateStr || '未知日期';
    }
}

// 显示温度图表
function showTemperatureChart(code, name) {
    console.log('显示温度图表:', code, name);
    // 这里可以添加显示温度图表的逻辑
    // 由于没有具体的图表实现，暂时只打印日志
}

// 显示基金净值图表
function showFundNavChart(code, type) {
    console.log('显示基金净值图表:', code, type);
    // 这里可以添加显示基金净值图表的逻辑
    // 由于没有具体的图表实现，暂时只打印日志
}

// 计算并显示温度星级
function calculateAndShowStarRating() {
    // 检查是否有数据
    if (!fundsData) {
        // 如果没有数据，显示默认值
        const avgStarElement = document.getElementById('avgStar');
        const starValueElement = document.getElementById('starValue');
        if (avgStarElement) avgStarElement.innerHTML = '';
        if (starValueElement) starValueElement.textContent = '--';
        return;
    }
    
    // 参考螺丝钉星级计算方式：
    // 中证全指数5000一星，5280二星，5560三星，5840四星，6120五星，6400六星
    // 先计算平均温度作为中证全指数的近似值
    let totalTemperature = 0;
    let count = 0;
    
    for (const category of Object.keys(codeConfig)) {
        const codes = codeConfig[category];
        if (!codes || codes.length === 0) continue;
        
        for (const code of codes) {
            const data = fundsData[code];
            if (!data) continue;
            
            // 计算温度
            let temperature;
            if (category === 'E') {
                // 行业类：温度 = PB分位点 × 100
                temperature = data.pb_percentile * 100;
            } else {
                // 其他类：温度 = (PE分位点 + PB分位点) / 2 × 100
                temperature = (data.pe_percentile + data.pb_percentile) / 2 * 100;
            }
            
            totalTemperature += temperature;
            count++;
        }
    }
    
    // 如果没有有效数据，显示默认值
    if (count === 0) {
        const avgStarElement = document.getElementById('avgStar');
        const starValueElement = document.getElementById('starValue');
        if (avgStarElement) avgStarElement.innerHTML = '';
        if (starValueElement) starValueElement.textContent = '--';
        return;
    }
    
    // 计算平均温度，作为中证全指数的近似值（调整为5000-6400范围）
    // 这里我们需要将温度值映射到中证全指数的点数范围
    // 假设温度范围是0-100，我们将其映射到5000-6400
    const avgTemperature = totalTemperature / count;
    // 映射公式：中证全指数 = 5000 + (avgTemperature / 100) * 1400
    const csi300Index = 5000 + (avgTemperature / 100) * 1400;
    
    // 根据中证全指数计算星级
    // 星级计算公式：星级 = 1 + (中证全指数 - 5000) / 280
    // 每280点对应1星的变化（从5000到6400共1400点，对应5星的变化）
    let starRating = 1 + (csi300Index - 5000) / 280;
    
    // 限制星级范围在1-6星之间
    starRating = Math.max(1, Math.min(6, starRating));
    
    // 更新页面显示
    const avgStarElement = document.getElementById('avgStar');
    const starValueElement = document.getElementById('starValue');
    
    if (avgStarElement) {
        // 显示对应数量的星星（取整数部分）
        avgStarElement.innerHTML = '⭐'.repeat(Math.floor(starRating));
    }
    
    if (starValueElement) {
        // 显示精确的小数星级（保留两位小数）
        starValueElement.textContent = starRating.toFixed(2);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    updateDate();
    calculateAndShowStarRating();
    loadAllData();
});

// 加载所有数据
async function loadAllData() {
    try {
        console.log('[基金温度] 开始加载所有数据');
        showLoading(true);
        // 加载 code.json
        console.log('[基金温度] 尝试加载 code.json');
        const codeRes = await fetch('code.json');
        if (!codeRes.ok) {
            throw new Error('code.json 加载失败');
        }
        codeConfig = await codeRes.json();
        console.log('[基金温度] code.json 加载成功');
        
        let csvText1, csvText2;
        let actualDataDate = '';
        let foundData = false;
        let currentFilename = '';
        
        // 列出所有已知的CSV文件，按日期倒序排列（最新的在前）
        const csvFiles = [
            '2026-01-14.csv',
            '2026-01-13.csv',
            '2026-01-12.csv',
            '2026-01-09.csv',
            '2026-01-08.csv',
            '2026-01-07.csv',
            '2026-01-06.csv',
            '2026-01-05.csv',
            '2025-12-31.csv'
        ];
        console.log('[基金温度] 准备加载CSV文件列表:', csvFiles);
        
        // 优先从本地加载最新的CSV文件
        for (const file of csvFiles) {
            try {
                console.log(`[基金温度] 尝试加载文件: ${file}`);
                const csvRes = await fetch(file);
                if (csvRes.ok) {
                    csvText1 = await csvRes.text();
                    console.log(`[基金温度] 文件内容长度: ${csvText1.length} 字符`);
                    fundsData = parseCSVFull(csvText1);
                    console.log(`[基金温度] 解析后的数据量: ${Object.keys(fundsData).length} 条`);
                    actualDataDate = file.replace('.csv', '');
                    currentFilename = file;
                    foundData = true;
                    console.log(`[基金温度] 成功加载: ${file}`);
                    break;
                } else {
                    console.log(`[基金温度] 文件不存在或无法访问: ${file}, 状态码: ${csvRes.status}`);
                }
            } catch (error) {
                // 忽略单个文件加载错误，继续尝试下一个
                console.log(`[基金温度] 加载文件失败: ${file}, 错误: ${error.message}`);
            }
        }
        
        // 如果本地没有找到任何文件，尝试使用data.csv作为最后的备选
        if (!foundData) {
            console.log('[基金温度] 本地文件加载失败，尝试加载data.csv作为备选');
            const backupRes = await fetch('data.csv');
            if (backupRes.ok) {
                csvText1 = await backupRes.text();
                fundsData = parseCSVFull(csvText1);
                actualDataDate = 'data.csv';
                foundData = true;
                console.log('[基金温度] 成功加载data.csv');
            } else {
                // 最后尝试从localStorage加载
                console.log('[基金温度] data.csv加载失败，尝试从localStorage加载');
                const cachedData = localStorage.getItem('csvData');
                if (cachedData) {
                    csvText1 = cachedData;
                    fundsData = parseCSVFull(csvText1);
                    actualDataDate = localStorage.getItem('lastDataDate') || '未知日期';
                    foundData = true;
                    console.log('[基金温度] 成功从localStorage加载数据');
                } else {
                    // 如果所有尝试都失败，抛出错误
                    throw new Error('所有CSV文件都加载失败');
                }
            }
        }
        
        // 尝试加载上一个CSV文件作为上两日涨跌数据
        try {
            // 获取当前文件在列表中的索引
            const currentIndex = csvFiles.findIndex(file => file === currentFilename);
            let previousFile = '';
            
            // 如果找到了当前文件，尝试加载下一个（即上一天）文件
            if (currentIndex > -1 && currentIndex < csvFiles.length - 1) {
                previousFile = csvFiles[currentIndex + 1];
            } else {
                // 否则尝试加载硬编码的上一天文件
                // 从当前文件名提取日期，减一天生成上一天文件名
                if (actualDataDate && actualDataDate !== 'data.csv' && actualDataDate !== '未知日期') {
                    const currentDate = new Date(actualDataDate);
                    currentDate.setDate(currentDate.getDate() - 1);
                    previousFile = currentDate.toISOString().split('T')[0] + '.csv';
                }
            }
            
            if (previousFile) {
                console.log(`[基金温度] 尝试加载上一天文件: ${previousFile}`);
                const csvRes2 = await fetch(previousFile);
                if (csvRes2.ok) {
                    csvText2 = await csvRes2.text();
                    oldData = parseOldCSVFull(csvText2);
                    console.log(`[基金温度] 成功加载上一天文件: ${previousFile}`);
                } else {
                    // 如果上一天的文件不存在，尝试使用old_data.csv作为备选
                    const backupRes = await fetch('old_data.csv');
                    if (backupRes.ok) {
                        csvText2 = await backupRes.text();
                        oldData = parseOldCSVFull(csvText2);
                        console.log(`[基金温度] 使用备选文件old_data.csv`);
                    } else {
                        oldData = {};
                        console.log(`[基金温度] 未找到上一天数据`);
                    }
                }
            } else {
                oldData = {};
                console.log(`[基金温度] 未找到上一天数据`);
            }
        } catch (error) {
            oldData = {};
            console.log(`[基金温度] 加载上一天数据失败: ${error.message}`);
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
        
        // 更新数据日期显示为实际使用的数据日期
        updateDate(actualDataDate);
        
        // 重新计算并显示温度星级
        calculateAndShowStarRating();
        
        // 保存基金温度数据到缓存
        const cacheKeySave = 'fundTempData_v4'; // 使用相同的新缓存键
        fundTempCache[cacheKeySave] = {
            fundsData: fundsData,
            oldData: oldData,
            codeConfig: codeConfig,
            actualDataDate: actualDataDate,
            timestamp: Date.now()
        };
        
        // 保存缓存到localStorage
        saveCache();
        console.log('[基金温度] 数据已保存到缓存');
        
        showLoading(false);
        
    } catch (error) {
        console.error('[基金温度] 加载数据失败:', error.message);
        
        // 即使出错，也尝试直接从最新的CSV文件加载，不依赖缓存
        try {
            console.log('[基金温度] 加载数据出错，尝试直接加载最新的CSV文件');
            // 列出所有已知的CSV文件，按日期倒序排列（最新的在前）
            const csvFiles = [
                '2026-01-14.csv',
                '2026-01-13.csv',
                '2026-01-12.csv',
                '2026-01-09.csv',
                '2026-01-08.csv',
                '2026-01-07.csv',
                '2026-01-06.csv',
                '2026-01-05.csv',
                '2025-12-31.csv'
            ];
            
            // 尝试加载最新的CSV文件
            for (const file of csvFiles) {
                try {
                    console.log(`[基金温度] 尝试直接加载文件: ${file}`);
                    const csvRes = await fetch(file);
                    if (csvRes.ok) {
                        const csvText = await csvRes.text();
                        fundsData = parseCSVFull(csvText);
                        const actualDataDate = file.replace('.csv', '');
                        
                        // 显示数据
                        renderFundTable();
                        updateDate(actualDataDate);
                        calculateAndShowStarRating();
                        showLoading(false);
                        return;
                    }
                } catch (fileError) {
                    // 忽略单个文件加载错误，继续尝试下一个
                    console.log(`[基金温度] 直接加载文件失败: ${file}, 错误: ${fileError.message}`);
                }
            }
            
            // 如果所有文件都加载失败，再尝试从localStorage加载
            console.log('[基金温度] 所有直接加载尝试失败，尝试从localStorage加载');
            const cacheKeyV4 = 'fundTempData_v4';
            if (localStorage.getItem(cacheKeyV4)) {
                const tempData = JSON.parse(localStorage.getItem(cacheKeyV4));
                fundsData = tempData.fundsData;
                oldData = tempData.oldData;
                codeConfig = tempData.codeConfig;
                
                // 显示数据
                renderFundTable();
                updateDate(tempData.actualDataDate);
                calculateAndShowStarRating();
                showLoading(false);
                return;
            }
        } catch (e) {
            // 所有尝试都失败，忽略
            console.error('[基金温度] 所有加载尝试都失败:', e.message);
        }
        
        // 如果没有缓存数据，显示默认的数据日期
        updateDate('未知日期');
        showLoading(false);
    }
}

// 加载所有历史CSV文件数据
async function loadHistoricalData() {
    try {
        // 显示加载中
        showLoading(true);
        
        // 只加载已知存在的CSV文件，避免大量404请求
        const allCsvFiles = [
            '2025-12-24.csv',
            '2025-12-25.csv',
            '2025-12-26.csv',
            '2025-12-29.csv',
            '2025-12-30.csv',
            '2025-12-31.csv',
            '2026-01-05.csv',
            '2026-01-06.csv',
            '2026-01-07.csv',
            '2026-01-08.csv',
            '2026-01-09.csv',
            '2026-01-12.csv',
            '2026-01-13.csv',
            '2026-01-14.csv'
        ];
        
        // 按日期排序
        allCsvFiles.sort();
        
        // 加载所有CSV文件数据
        const historicalData = {};
        
        for (const file of allCsvFiles) {
            try {
                const response = await fetch(file);
                if (response.ok) {
                    const csvText = await response.text();
                    const data = parseCSVFull(csvText);
                    const date = file.replace('.csv', '');
                    
                    // 处理每个指数的数据
                    for (const [code, indexData] of Object.entries(data)) {
                        if (!historicalData[code]) {
                            historicalData[code] = [];
                        }
                        
                        // 检查是否已经存在该日期的数据（避免重复）
                        const existingIndex = historicalData[code].findIndex(item => item.date === date);
                        if (existingIndex === -1) {
                            // 计算温度
                            let temperature;
                            const category = CATEGORY_MAP[code] || '';
                            if (category === 'E') {
                                // 行业类：温度 = PB分位点 × 100
                                temperature = indexData.pb_percentile * 100;
                            } else {
                                // 其他类：温度 = (PE分位点 + PB分位点) / 2 × 100
                                temperature = (indexData.pe_percentile + indexData.pb_percentile) / 2 * 100;
                            }
                            
                            historicalData[code].push({
                                date,
                                temperature,
                                name: indexData.name
                            });
                        }
                    }
                }
            } catch (fileError) {
                // 忽略不存在的文件错误
            }
        }
        
        // 按日期排序每个指数的历史数据
        for (const code in historicalData) {
            historicalData[code].sort((a, b) => new Date(a.date) - new Date(b.date));
        }
        
        showLoading(false);
        return historicalData;
    } catch (error) {
        showLoading(false);
        return {};
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
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center;">数据加载中...</td></tr>';
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
        
        // 添加点击事件
        row.onclick = () => showTemperatureChart(code, data.name);
        
        // 获取场内代码和场外代码
        const fundCodes = FUND_CODES_MAP[code] || {场内代码: '-', 场外代码: '-'}; 
        const 场内代码 = fundCodes.场内代码;
        const 场外代码 = fundCodes.场外代码;
        
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
                <td class="temperature-cell" style="cursor: pointer;">
                    <span class="temp-value" style="color: ${tempColor}; font-weight: bold;">${temperature.toFixed(2)}°C</span>
                </td>
                <td>${yearChangeHtml}</td>
                <td>${changeHtml}</td>
                <td>${twoDayChangeHtml}</td>
                <td style="${场内代码 !== '-' ? 'cursor: pointer; color: #48dbfb; text-decoration: underline;' : ''}">${场内代码}</td>
                <td style="${场外代码 !== '-' ? 'cursor: pointer; color: #48dbfb; text-decoration: underline;' : ''}">${场外代码}</td>
                <td>${attentionHtml}</td>
            `;
        } else {
            row.innerHTML = `
                <td>${categoryInfo.name}</td>
                <td>${code}</td>
                <td>${data.name}</td>
                <td class="temperature-cell" style="cursor: pointer;">
                    <span class="temp-value" style="color: ${tempColor}; font-weight: bold;">${temperature.toFixed(2)}°C</span>
                </td>
                <td>${yearChangeHtml}</td>
                <td>${changeHtml}</td>
                <td>${twoDayChangeHtml}</td>
                <td style="${场内代码 !== '-' ? 'cursor: pointer; color: #48dbfb; text-decoration: underline;' : ''}">${场内代码}</td>
                <td style="${场外代码 !== '-' ? 'cursor: pointer; color: #48dbfb; text-decoration: underline;' : ''}">${场外代码}</td>
                <td>${attentionHtml}</td>
            `;
        }
        
        // 添加点击事件
        row.querySelectorAll('td')[3].onclick = (e) => {
            e.stopPropagation();
            showTemperatureChart(code, data.name);
        };
        
        // 为场内代码添加点击事件
        row.querySelectorAll('td')[7].onclick = (e) => {
            e.stopPropagation();
            if (场内代码 && 场内代码 !== '-') {
                showFundNavChart(场内代码, '场内');
            }
        };
        
        // 为场外代码添加点击事件
        row.querySelectorAll('td')[8].onclick = (e) => {
            e.stopPropagation();
            if (场外代码 && 场外代码 !== '-') {
                showFundNavChart(场外代码, '场外');
            }
        };
        
        // 整行点击事件
        row.onclick = () => showTemperatureChart(code, data.name);
        
        tbody.appendChild(row);
        displayedCount++;
    }
    
    // 添加提示信息
    if (displayedCount > 0) {
        const infoRow = document.createElement('tr');
        infoRow.innerHTML = `
            <td colspan="10" style="text-align: center; background-color: rgba(0,0,0,0.2); padding: 10px;">
                <span style="color: rgba(255,255,255,0.8);">💡 提示：点击任意指数行查看历史温度曲线图</span>
            </td>
        `;
        tbody.appendChild(infoRow);
    }
    
    // 如果没有显示任何数据，显示提示
    if (displayedCount === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center;">没有找到匹配的指数数据，请检查CSV数据是否包含有效代码</td></tr>';
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
    val = val.replace(/%$/g, '');
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
}

// 处理涨跌幅（带百分号，需要乘以100）
function parsePercent(val) {
    if (!val) return 0;
    val = parseValue(val);
    // 移除百分号
    val = val.replace(/%$/g, '');
    const num = parseFloat(val);
    // 乘以100，将小数转换为百分比，例如 0.0368 -> 3.68%, 0.0022 -> 0.22%
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
        else if (h === 'PB' || hLower === 'pb' || h === 'PB(当前值)') colMap.pb = idx;
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
            pe_percentile: parseNumber(values[colMap.pe_percentile]), // 直接使用原始数值，CSV中已经是小数形式
            pb_percentile: parseNumber(values[colMap.pb_percentile]), // 直接使用原始数值，CSV中已经是小数形式
            attention: parseValue(values[colMap.attention]) || ''
        };
        
        data[code] = itemData;
    }
    
    return data;
}

function parseOldCSVFull(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return {};
    
    // 解析表头，支持中英文列名
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    
    // 创建列名映射
    const colMap = {};
    headers.forEach((h, idx) => {
        const hLower = h.toLowerCase();
        if (h === '指数代码' || hLower === 'code') colMap.code = idx;
        else if (h === '今日涨跌幅' || hLower === 'change_pct' || h === '涨跌幅' || h === '上一日涨跌') colMap.change_pct = idx;
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
            change_pct: parsePercent(values[colMap.change_pct])
        };
        
        data[code] = itemData;
    }
    
    return data;
}

// 处理CSV文件上传
function handleCSVUpload(input) {
    const file = input.files[0];
    if (!file) return;
    
    // 显示文件名
    document.getElementById('csvFileName').textContent = file.name;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csvText = e.target.result;
            
            // 解析CSV数据
            const csvData = parseCSVFull(csvText);
            
            // 从文件名提取日期
            const fileName = file.name;
            const dateMatch = fileName.match(/(\d{4}-\d{2}-\d{2})\.csv$/);
            let dataDate = '';
            
            if (dateMatch) {
                dataDate = dateMatch[1];
            } else {
                // 如果文件名中没有日期，使用当前日期
                const today = new Date();
                dataDate = today.toISOString().split('T')[0];
            }
            
            // 保存数据到localStorage
            localStorage.setItem('csvData', csvText);
            localStorage.setItem('lastDataDate', dataDate);
            
            // 重新加载数据
            loadAllData();
            
            // 显示上传成功信息
            document.getElementById('csvUploadStatus').innerHTML = `<span style="color: green;">✅ 数据上传成功，已更新到 ${dataDate}</span>`;
            
            // 清空文件输入
            input.value = '';
        } catch (error) {
            console.error('[基金温度] CSV文件解析失败:', error.message);
            document.getElementById('csvUploadStatus').innerHTML = `<span style="color: red;">❌ 数据上传失败: ${error.message}</span>`;
        }
    };
    
    reader.onerror = function() {
        document.getElementById('csvUploadStatus').innerHTML = '<span style="color: red;">❌ 读取文件失败</span>';
    };
    
    reader.readAsText(file);
}