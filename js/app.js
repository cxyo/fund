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
    '931008': {场内代码: '-', 场外代码: '004854'},
    '399998': {场内代码: '013275', 场外代码: '161032'},
    '399967': {场内代码: '512660', 场外代码: '002199'},
    '980027': {场内代码: '159566', 场外代码: '-'},
    '000928': {场内代码: '159930', 场外代码: '-'},
    '399395': {场内代码: '160221', 场外代码: '160221'},
    '000993': {场内代码: '159939', 场外代码: '000942'},
    '000979': {场内代码: '161715', 场外代码: '161715'},
    '931594': {场内代码: '-', 场外代码: '-'},
    '930653': {场内代码: '-', 场外代码: '001631'},
    '399997': {场内代码: '161725', 场外代码: '161725'},
    '399814': {场内代码: '-', 场外代码: '001027'},
    '399976': {场内代码: '515030', 场外代码: '161028'},
    '399971': {场内代码: '512980', 场外代码: '004752'},
    '931152': {场内代码: '159992', 场外代码: '012738'},
    '000827': {场内代码: '512580', 场外代码: '001064'},
    '931151': {场内代码: '515790', 场外代码: '011102'},
    '931087': {场内代码: '515000', 场外代码: '007873'},
    '990001': {场内代码: '512760', 场外代码: '008281'},
    '980017': {场内代码: '159995', 场外代码: '008888'},
    '931752': {场内代码: '-', 场外代码: '-'},
    'H30590': {场内代码: '562500', 场外代码: '014881'},
    '931079': {场内代码: '515050', 场外代码: '008087'},
    '931071': {场内代码: '515980', 场外代码: '008021'},
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

// 每天晚上7点（19:00）更新数据的时间戳
function getNextUpdateTime() {
    const now = new Date();
    const nextUpdate = new Date(now);
    nextUpdate.setHours(19, 0, 0, 0);
    
    // 如果当前时间已经过了今天的7点，那么设置为明天的7点
    if (now > nextUpdate) {
        nextUpdate.setDate(nextUpdate.getDate() + 1);
    }
    
    return nextUpdate.getTime();
}

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
    }
}

// 检查缓存是否有效
function isCacheValid(key, cacheType = 'nav') {
    const cache = cacheType === 'nav' ? fundNavCache : fundTempCache;
    if (!cache[key]) {
        return false;
    }
    
    const now = Date.now();
    // 如果是基金温度数据，检查是否到了明天的7点
    if (cacheType === 'temp') {
        const nextUpdateTime = getNextUpdateTime();
        return now < nextUpdateTime;
    }
    
    // 基金净值数据使用常规过期时间
    return now - cache[key].timestamp < CACHE_EXPIRE_TIME;
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

document.addEventListener('DOMContentLoaded', function() {
    updateDate();
    calculateAndShowStarRating();
    loadAllData();
});

// 加载所有数据
async function loadAllData() {
    try {
        // 检查基金温度数据缓存是否有效
        const cacheKey = 'fundTempData';
        if (isCacheValid(cacheKey, 'temp')) {
            console.log('[基金温度] 使用缓存数据');
            fundsData = fundTempCache[cacheKey].fundsData;
            oldData = fundTempCache[cacheKey].oldData;
            codeConfig = fundTempCache[cacheKey].codeConfig;
            
            // 显示数据
            renderFundTable();
            updateDate(fundTempCache[cacheKey].actualDataDate);
            calculateAndShowStarRating();
            showLoading(false);
            return;
        }
        
        // 显示加载中
        showLoading(true);
        
        // 加载 code.json
        const codeRes = await fetch('code.json');
        if (!codeRes.ok) {
            throw new Error('code.json 加载失败');
        }
        codeConfig = await codeRes.json();
        
        // 获取今天和昨天的日期
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // 格式化日期为 YYYY-MM-DD 格式
        const formatDate = (date) => {
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        };
        
        const todayStr = formatDate(today);
        const yesterdayStr = formatDate(yesterday);
        
        let csvText1, csvText2;
        let actualDataDate = yesterdayStr; // 默认使用昨天的日期作为数据日期
        
        // 检查当前时间，如果在晚上7点之前，直接使用昨天的数据，不尝试加载今天的文件
        const now = new Date();
        const hour = now.getHours();
        const useTodayData = hour >= 19; // 晚上7点以后才尝试使用今天的数据
        
        // 尝试加载CSV文件
        try {
            if (useTodayData) {
                // 晚上7点以后，优先尝试本地今天的文件
                const csvRes1 = await fetch(`${todayStr}.csv`);
                if (csvRes1.ok) {
                    csvText1 = await csvRes1.text();
                    fundsData = parseCSVFull(csvText1);
                    actualDataDate = todayStr; // 更新为今天的日期
                } else {
                    // 今天的本地文件不存在，尝试昨天的本地文件
                    const csvResYesterday = await fetch(`${yesterdayStr}.csv`);
                    if (csvResYesterday.ok) {
                        csvText1 = await csvResYesterday.text();
                        fundsData = parseCSVFull(csvText1);
                    } else {
                        // 本地文件都不存在，尝试使用data.csv作为备选
                        const backupRes = await fetch('data.csv');
                        if (backupRes.ok) {
                            csvText1 = await backupRes.text();
                            fundsData = parseCSVFull(csvText1);
                        } else {
                            // 本地文件都失败，尝试从GitHub获取
                            const githubRepo = localStorage.getItem('githubRepo') || '';
                            if (githubRepo) {
                                // 从GitHub获取今天的数据
                                const githubUrl = `https://cdn.jsdelivr.net/gh/${githubRepo}/${todayStr}.csv`;
                                const githubRes = await fetch(githubUrl);
                                if (githubRes.ok) {
                                    csvText1 = await githubRes.text();
                                    fundsData = parseCSVFull(csvText1);
                                    actualDataDate = todayStr;
                                } else {
                                    // 今天的GitHub数据不存在，尝试昨天的
                                    const githubYesterdayUrl = `https://cdn.jsdelivr.net/gh/${githubRepo}/${yesterdayStr}.csv`;
                                    const githubYesterdayRes = await fetch(githubYesterdayUrl);
                                    if (githubYesterdayRes.ok) {
                                        csvText1 = await githubYesterdayRes.text();
                                        fundsData = parseCSVFull(csvText1);
                                    } else {
                                        // 如果GitHub数据也失败，尝试使用已知存在的历史CSV文件
                                        const knownCsvFiles = [
                                            '2025-12-31.csv',
                                            '2026-01-05.csv',
                                            '2026-01-06.csv',
                                            '2026-01-07.csv'
                                        ];
                                        
                                        // 尝试加载已知的历史CSV文件
                                        for (const knownFile of knownCsvFiles) {
                                            try {
                                                const knownRes = await fetch(knownFile);
                                                if (knownRes.ok) {
                                                    csvText1 = await knownRes.text();
                                                    fundsData = parseCSVFull(csvText1);
                                                    actualDataDate = knownFile.replace('.csv', '');
                                                    break;
                                                }
                                            } catch (knownError) {
                                                // 忽略单个文件的错误，继续尝试下一个
                                            }
                                        }
                                        
                                        // 如果所有已知文件都失败，抛出错误
                                        if (!csvText1) {
                                            throw new Error('所有CSV文件都加载失败');
                                        }
                                    }
                                }
                            } else {
                                // 如果没有设置githubRepo，尝试使用已知存在的历史CSV文件
                                const knownCsvFiles = [
                                    '2025-12-31.csv',
                                    '2026-01-05.csv',
                                    '2026-01-06.csv',
                                    '2026-01-07.csv'
                                ];
                                
                                // 尝试加载已知的历史CSV文件
                                for (const knownFile of knownCsvFiles) {
                                    try {
                                        const knownRes = await fetch(knownFile);
                                        if (knownRes.ok) {
                                            csvText1 = await knownRes.text();
                                            fundsData = parseCSVFull(csvText1);
                                            actualDataDate = knownFile.replace('.csv', '');
                                            break;
                                        }
                                    } catch (knownError) {
                                        // 忽略单个文件的错误，继续尝试下一个
                                    }
                                }
                                
                                // 如果所有已知文件都失败，抛出错误
                                if (!csvText1) {
                                    throw new Error('所有CSV文件都加载失败');
                                }
                            }
                        }
                    }
                }
            } else {
                // 晚上7点之前，直接尝试加载昨天的本地文件
                const csvResYesterday = await fetch(`${yesterdayStr}.csv`);
                if (csvResYesterday.ok) {
                    csvText1 = await csvResYesterday.text();
                    fundsData = parseCSVFull(csvText1);
                } else {
                    // 昨天的本地文件不存在，尝试使用data.csv作为备选
                    const backupRes = await fetch('data.csv');
                    if (backupRes.ok) {
                        csvText1 = await backupRes.text();
                        fundsData = parseCSVFull(csvText1);
                    } else {
                        // 本地文件都失败，尝试从GitHub获取昨天的数据
                        const githubRepo = localStorage.getItem('githubRepo') || '';
                        if (githubRepo) {
                            const githubYesterdayUrl = `https://cdn.jsdelivr.net/gh/${githubRepo}/${yesterdayStr}.csv`;
                            const githubYesterdayRes = await fetch(githubYesterdayUrl);
                            if (githubYesterdayRes.ok) {
                                csvText1 = await githubYesterdayRes.text();
                                fundsData = parseCSVFull(csvText1);
                            } else {
                                // 如果GitHub数据也失败，尝试使用已知存在的历史CSV文件
                                const knownCsvFiles = [
                                    '2025-12-31.csv',
                                    '2026-01-05.csv',
                                    '2026-01-06.csv',
                                    '2026-01-07.csv'
                                ];
                                
                                // 尝试加载已知的历史CSV文件
                                for (const knownFile of knownCsvFiles) {
                                    try {
                                        const knownRes = await fetch(knownFile);
                                        if (knownRes.ok) {
                                            csvText1 = await knownRes.text();
                                            fundsData = parseCSVFull(csvText1);
                                            actualDataDate = knownFile.replace('.csv', '');
                                            break;
                                        }
                                    } catch (knownError) {
                                        // 忽略单个文件的错误，继续尝试下一个
                                    }
                                }
                                
                                // 如果所有已知文件都失败，抛出错误
                                if (!csvText1) {
                                    throw new Error('所有CSV文件都加载失败');
                                }
                            }
                        } else {
                            // 如果没有设置githubRepo，尝试使用已知存在的历史CSV文件
                            const knownCsvFiles = [
                                '2025-12-31.csv',
                                '2026-01-05.csv',
                                '2026-01-06.csv',
                                '2026-01-07.csv'
                            ];
                            
                            // 尝试加载已知的历史CSV文件
                            for (const knownFile of knownCsvFiles) {
                                try {
                                    const knownRes = await fetch(knownFile);
                                    if (knownRes.ok) {
                                        csvText1 = await knownRes.text();
                                        fundsData = parseCSVFull(csvText1);
                                        actualDataDate = knownFile.replace('.csv', '');
                                        break;
                                    }
                                } catch (knownError) {
                                    // 忽略单个文件的错误，继续尝试下一个
                                }
                            }
                            
                            // 如果所有已知文件都失败，抛出错误
                            if (!csvText1) {
                                throw new Error('所有CSV文件都加载失败');
                            }
                        }
                    }
                }
            }
        } catch (error) {
            // 尝试加载昨天的文件
            try {
                const csvResYesterday = await fetch(`${yesterdayStr}.csv`);
                if (csvResYesterday.ok) {
                    csvText1 = await csvResYesterday.text();
                    fundsData = parseCSVFull(csvText1);
                } else {
                    // 尝试使用data.csv作为备选
                    const backupRes = await fetch('data.csv');
                    if (backupRes.ok) {
                        csvText1 = await backupRes.text();
                        fundsData = parseCSVFull(csvText1);
                    } else {
                        // 本地文件都失败，尝试从GitHub获取
                        const githubRepo = localStorage.getItem('githubRepo') || '';
                        if (githubRepo) {
                            // 从GitHub获取昨天的数据
                            const githubYesterdayUrl = `https://cdn.jsdelivr.net/gh/${githubRepo}/${yesterdayStr}.csv`;
                            const githubYesterdayRes = await fetch(githubYesterdayUrl);
                            if (githubYesterdayRes.ok) {
                                csvText1 = await githubYesterdayRes.text();
                                fundsData = parseCSVFull(csvText1);
                            } else {
                                throw new Error('GitHub CSV文件加载失败');
                            }
                        } else {
                            throw new Error('所有CSV文件都加载失败');
                        }
                    }
                }
            } catch (backupError) {
                // 所有本地尝试失败，尝试从GitHub获取
                const githubRepo = localStorage.getItem('githubRepo') || '';
                if (githubRepo) {
                    try {
                        if (useTodayData) {
                            // 晚上7点以后，尝试从GitHub获取今天的数据
                            const githubUrl = `https://cdn.jsdelivr.net/gh/${githubRepo}/${todayStr}.csv`;
                            const githubRes = await fetch(githubUrl);
                            if (githubRes.ok) {
                                csvText1 = await githubRes.text();
                                fundsData = parseCSVFull(csvText1);
                                actualDataDate = todayStr;
                            } else {
                                // 今天的GitHub数据不存在，尝试昨天的
                                const githubYesterdayUrl = `https://cdn.jsdelivr.net/gh/${githubRepo}/${yesterdayStr}.csv`;
                                const githubYesterdayRes = await fetch(githubYesterdayUrl);
                                if (githubYesterdayRes.ok) {
                                    csvText1 = await githubYesterdayRes.text();
                                    fundsData = parseCSVFull(csvText1);
                                } else {
                                    throw new Error('GitHub CSV文件加载失败');
                                }
                            }
                        } else {
                            // 晚上7点之前，直接从GitHub获取昨天的数据
                            const githubYesterdayUrl = `https://cdn.jsdelivr.net/gh/${githubRepo}/${yesterdayStr}.csv`;
                            const githubYesterdayRes = await fetch(githubYesterdayUrl);
                            if (githubYesterdayRes.ok) {
                                csvText1 = await githubYesterdayRes.text();
                                fundsData = parseCSVFull(csvText1);
                            } else {
                                throw new Error('GitHub CSV文件加载失败');
                            }
                        }
                    } catch (githubError) {
                        throw new Error('所有CSV文件都加载失败');
                    }
                } else {
                    throw new Error('所有CSV文件都加载失败');
                }
            }
        }
        
        // 尝试加载昨天的CSV文件
        try {
            const csvRes2 = await fetch(`${yesterdayStr}.csv`);
            if (csvRes2.ok) {
                csvText2 = await csvRes2.text();
                oldData = parseOldCSVFull(csvText2);
            } else {
                // 如果昨天的文件不存在，尝试使用old_data.csv作为备选
                const backupRes = await fetch('old_data.csv');
                if (backupRes.ok) {
                    csvText2 = await backupRes.text();
                    oldData = parseOldCSVFull(csvText2);
                } else {
                    // 本地文件都失败，尝试从GitHub获取昨天的数据
                    const githubRepo = localStorage.getItem('githubRepo') || '';
                    if (githubRepo) {
                        const githubYesterdayUrl = `https://cdn.jsdelivr.net/gh/${githubRepo}/${yesterdayStr}.csv`;
                        const githubYesterdayRes = await fetch(githubYesterdayUrl);
                        if (githubYesterdayRes.ok) {
                            csvText2 = await githubYesterdayRes.text();
                            oldData = parseOldCSVFull(csvText2);
                        } else {
                            oldData = {};
                        }
                    } else {
                        oldData = {};
                    }
                }
            }
        } catch (error) {
            // 尝试从GitHub获取昨天的数据
            try {
                const githubRepo = localStorage.getItem('githubRepo') || '';
                if (githubRepo) {
                    const githubYesterdayUrl = `https://cdn.jsdelivr.net/gh/${githubRepo}/${yesterdayStr}.csv`;
                    const githubYesterdayRes = await fetch(githubYesterdayUrl);
                    if (githubYesterdayRes.ok) {
                        csvText2 = await githubYesterdayRes.text();
                        oldData = parseOldCSVFull(csvText2);
                    } else {
                        oldData = {};
                    }
                } else {
                    oldData = {};
                }
            } catch (githubError) {
                oldData = {};
            }
        }
        
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
        
        // 更新数据日期显示为实际使用的数据日期
        updateDate(actualDataDate);
        
        // 重新计算并显示温度星级
        calculateAndShowStarRating();
        
        // 保存基金温度数据到缓存
        const cacheKey = 'fundTempData';
        fundTempCache[cacheKey] = {
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
        // 加载数据失败
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
            '2026-01-07.csv'
        ];
        
        // 检查今天的CSV文件是否存在，如果存在则添加
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const todayFile = `${todayStr}.csv`;
        if (!allCsvFiles.includes(todayFile)) {
            allCsvFiles.push(todayFile);
        }
        
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
        // 优先使用localStorage中的数据（用户上传的数据）
        if (fundsData) {
            // 直接从fundsData中获取中证全指(000985)数据
            const row = fundsData['000985'];
            
            if (row) {
                // 获取PE和PB分位点
                const pe = row.pe_percentile;
                const pb = row.pb_percentile;
                
                // 计算温度星级，使用正确的系数5.34
                const starRating = (pe * 0.29 + pb * 0.71) * 5.34;
                updateStarDisplay(starRating);
                return;
            }
        }
        
        // 如果fundsData中没有数据，尝试从localStorage中获取用户上传的数据
        const localCsvData = localStorage.getItem('csvData');
        if (localCsvData) {
            // 使用parseCSVFull函数解析数据
            const data = parseCSVFull(localCsvData);
            
            // 从解析后的数据中获取中证全指(000985)
            const row = data['000985'];
            
            if (row) {
                // 获取PE和PB分位点
                const pe = row.pe_percentile;
                const pb = row.pb_percentile;
                
                // 计算温度星级，使用正确的系数5.34
                const starRating = (pe * 0.29 + pb * 0.71) * 5.34;
                updateStarDisplay(starRating);
                return;
            }
        }
        
        // 否则，使用默认的数据加载逻辑
        // 获取今天和昨天的日期
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const formatDate = (date) => {
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        };
        
        const todayStr = formatDate(today);
        const yesterdayStr = formatDate(yesterday);
        
        let csvText;
        let csvFound = false;
        
        // 优先使用今天的数据
        try {
            const response = await fetch(`${todayStr}.csv`);
            if (response.ok) {
                csvText = await response.text();
                csvFound = true;
            }
        } catch (todayError) {
            // 忽略错误，尝试使用昨天的数据
        }
        
        // 如果今天数据未找到，使用昨天的数据
        if (!csvFound) {
            try {
                const response = await fetch(`${yesterdayStr}.csv`);
                if (response.ok) {
                    csvText = await response.text();
                    csvFound = true;
                }
            } catch (yesterdayError) {
                // 忽略错误，尝试从GitHub获取数据
            }
        }
        
        // 如果本地数据未找到，尝试从GitHub获取数据
        if (!csvFound) {
            try {
                const githubRepo = localStorage.getItem('githubRepo') || '';
                if (githubRepo) {
                    // 尝试从GitHub获取今天的数据
                    const githubTodayUrl = `https://cdn.jsdelivr.net/gh/${githubRepo}/${todayStr}.csv`;
                    const githubTodayRes = await fetch(githubTodayUrl);
                    
                    if (githubTodayRes.ok) {
                        csvText = await githubTodayRes.text();
                        csvFound = true;
                    } else {
                        // 今天的GitHub数据不存在，尝试昨天的
                        const githubYesterdayUrl = `https://cdn.jsdelivr.net/gh/${githubRepo}/${yesterdayStr}.csv`;
                        const githubYesterdayRes = await fetch(githubYesterdayUrl);
                        
                        if (githubYesterdayRes.ok) {
                            csvText = await githubYesterdayRes.text();
                            csvFound = true;
                        }
                    }
                }
            } catch (githubError) {
                // 忽略错误
            }
        }
        
        if (!csvFound) {
            return;
        }
        
        // 使用parseCSVFull函数解析数据
        const data = parseCSVFull(csvText);
        
        // 从解析后的数据中获取中证全指(000985)
        const row = data['000985'];
        
        if (!row) {
            return;
        }
        
        // 获取PE和PB分位点
        const pe = row.pe_percentile;
        const pb = row.pb_percentile;
        
        // 计算温度星级，使用正确的系数5.34
        const starRating = (pe * 0.29 + pb * 0.71) * 5.34;
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
function updateDate(customDate = null) {
    const dateEl = document.getElementById('dataDate');
    if (dateEl) {
        if (customDate) {
            // 使用传入的自定义日期
            dateEl.textContent = customDate;
        } else {
            // 默认显示今天的日期
            const today = new Date();
            dateEl.textContent = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        }
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





// 获取基金历史净值数据 - 支持分页获取和缓存
async function getFundNavData(code, days = 30) {
    try {
        // 生成缓存键，包含基金代码和天数
        const cacheKey = `${code}_${days}`;
        
        // 检查缓存是否有效
        if (isCacheValid(cacheKey)) {
            console.log(`[基金净值] 使用缓存数据: ${code}_${days}`);
            return fundNavCache[cacheKey].data;
        }
        
        // 计算开始日期和结束日期
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);
        
        // 格式化日期为YYYY-MM-DD
        const endDateStr = endDate.toISOString().split('T')[0];
        const startDateStr = startDate.toISOString().split('T')[0];
        
        console.log(`[基金净值] 准备获取数据: 代码=${code}, 天数=${days}, 日期范围=${startDateStr}至${endDateStr}`);
        
        // 使用正确的API地址
        const url = `https://api.fund.eastmoney.com/f10/lsjz`;
        
        // 计算需要的总页数（每页最多20条数据）
        const totalPages = Math.ceil(days / 20);
        console.log(`[基金净值] 需要获取 ${totalPages} 页数据`);
        
        // 存储所有页的数据
        let allFormattedData = [];
        
        // 循环获取所有页面数据
        for (let pageIndex = 1; pageIndex <= totalPages; pageIndex++) {
            console.log(`[基金净值] 获取第 ${pageIndex} 页数据`);
            
            // 构建请求参数
            const params = new URLSearchParams();
            params.append('fundCode', code); // 使用fundCode替代code
            params.append('pageIndex', pageIndex);
            params.append('pageSize', 20); // 每页最多20条数据
            params.append('startDate', startDateStr);
            params.append('endDate', endDateStr);
            params.append('_', Date.now()); // 添加时间戳参数
            
            const callbackName = `jQuery18305932565413289966_${Date.now()}_${pageIndex}`;
            const fullUrl = `${url}?${params.toString()}&callback=${callbackName}`;
            console.log(`[基金净值] 请求URL: ${fullUrl}`);
            
            // 创建Promise来处理JSONP请求
            const pageData = await new Promise((resolve) => {
                // 定义全局回调函数
                window[callbackName] = function(data) {
                    // 清理回调函数
                    delete window[callbackName];
                    
                    // 检查API返回状态
                    if (data && data.ErrCode === 0 && data.Data && data.Data.LSJZList) {
                        const lsjzList = data.Data.LSJZList;
                        console.log(`[基金净值] 第 ${pageIndex} 页原始净值列表长度: ${lsjzList.length}`);
                        
                        // 转换为标准化的数据格式
                        const formattedData = lsjzList.map(item => ({
                            '净值日期': item.FSRQ, // 净值日期
                            '单位净值': item.DWJZ, // 单位净值
                            '累计净值': item.LJJZ, // 累计净值
                            '日增长率': item.JZZZL || '' // 日增长率
                        }));
                        
                        console.log(`[基金净值] 第 ${pageIndex} 页解析后的数据长度: ${formattedData.length}`);
                        resolve(formattedData);
                    } else {
                        console.error(`[基金净值] API返回错误:`, data);
                        // 当API返回错误时，尝试使用缓存数据
                        resolve([]);
                    }
                };
                
                // 创建script标签
                const script = document.createElement('script');
                script.src = fullUrl;
                script.type = 'text/javascript';
                script.charset = 'utf-8';
                
                // 10秒超时
                const timeout = setTimeout(() => {
                    console.error(`[基金净值] 请求超时: ${fullUrl}`);
                    // 清理资源
                    if (script.parentNode) {
                        script.parentNode.removeChild(script);
                    }
                    if (window[callbackName]) {
                        delete window[callbackName];
                    }
                    resolve([]);
                }, 10000);
                
                // 错误处理
                script.onerror = function() {
                    console.error(`[基金净值] 请求错误: ${fullUrl}`);
                    // 清理资源
                    clearTimeout(timeout);
                    if (script.parentNode) {
                        script.parentNode.removeChild(script);
                    }
                    if (window[callbackName]) {
                        delete window[callbackName];
                    }
                    resolve([]);
                };
                
                // 添加到head并执行
                document.head.appendChild(script);
            });
            
            // 合并当前页数据到总数据
            allFormattedData = [...allFormattedData, ...pageData];
            
            // 如果当前页数据不足20条，说明已经是最后一页
            if (pageData.length < 20) {
                break;
            }
        }
        
        console.log(`[基金净值] 总数据长度: ${allFormattedData.length}`);
        
        // 将数据存入缓存
        fundNavCache[cacheKey] = {
            data: allFormattedData,
            timestamp: Date.now()
        };
        
        // 保存缓存到localStorage
        saveCache();
        
        // 返回总数据
        return allFormattedData;
        
    } catch (error) {
        console.error(`[基金净值] 获取数据错误:`, error);
        return [];
    }
}

// 显示基金净值图表
async function showFundNavChart(code, type) {
    // 更新图表状态，使用默认的20天
    currentChartState = {
        type: 'nav',
        code: code,
        name: `${type === '场内' ? '场内' : '场外'}基金 ${code}`,
        fundType: type,
        days: 20 // 使用默认的20天
    };
    
    // 显示图表区域
    const chartSection = document.querySelector('.chart-section');
    if (chartSection) {
        chartSection.style.display = 'block';
    }
    
    // 设置图表标题
    const chartTitle = document.getElementById('chartTitle');
    if (chartTitle) {
        chartTitle.textContent = `${type === '场内' ? '场内' : '场外'}基金 ${code} 近${currentChartState.days}日净值走势`;
    }
    
    // 更新时间范围按钮的激活状态
    updateTimeButtons(currentChartState.days);
    
    // 显示加载状态
    showNotification(`正在获取基金 ${code} 的${currentChartState.days}日净值数据...`, 'info');
    
    // 加载基金净值数据
    const navData = await getFundNavData(code, currentChartState.days);
    
    // 检查是否有数据
    if (navData.length === 0) {
        showNotification(`暂无${type === '场内' ? '场内' : '场外'}基金 ${code} 的历史净值数据或数据获取失败`, 'warning');
        
        // 初始化空图表，避免页面显示异常
        const chartContainer = document.getElementById('temperatureChart');
        if (chartContainer) {
            const chart = echarts.init(chartContainer);
            chart.setOption({
                title: {
                    text: '暂无净值数据',
                    left: 'center',
                    top: 'middle',
                    textStyle: {
                        color: '#999'
                    }
                },
                series: []
            });
        }
        return;
    }
    
    // 显示成功消息
    showNotification(`成功获取基金 ${code} 的${navData.length}条净值数据`, 'success');
    
    // 准备图表数据
    // 先检查数据格式
    
    // 尝试多种可能的日期字段名
    const dateField = navData[0]['净值日期'] !== undefined ? '净值日期' : 
                     navData[0]['净值日期 '] !== undefined ? '净值日期 ' : 
                     navData[0]['日期'] !== undefined ? '日期' : 
                     Object.keys(navData[0])[0];
    
    // 尝试多种可能的单位净值字段名
    const navField = navData[0]['单位净值'] !== undefined ? '单位净值' : 
                     navData[0]['单位净值 '] !== undefined ? '单位净值 ' : 
                     navData[0]['净值'] !== undefined ? '净值' : 
                     Object.keys(navData[0])[1];
    
    // 尝试多种可能的累计净值字段名
    const accumNavField = navData[0]['累计净值'] !== undefined ? '累计净值' : 
                         navData[0]['累计净值 '] !== undefined ? '累计净值 ' : 
                         navData[0]['累计'] !== undefined ? '累计' : 
                         Object.keys(navData[0])[2];
    
    const dates = navData.map(item => item[dateField]).reverse();
    const navValues = navData.map(item => parseFloat(item[navField])).reverse();
    const accumNavValues = navData.map(item => parseFloat(item[accumNavField])).reverse();
    
    // 初始化图表
    const chartContainer = document.getElementById('temperatureChart');
    if (!chartContainer) {
        return;
    }
    
    const chart = echarts.init(chartContainer);
    
    // 设置图表选项
    const option = {
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicOut',
        series: [
            {
                type: 'line',
                name: '单位净值',
                data: navValues.map((nav, index) => [dates[index], nav]),
                symbolSize: 4,
                showSymbol: true,
                smooth: true,
                lineStyle: {
                    width: 2,
                    color: '#51cf66'
                },
                markPoint: {
                    data: [
                        { name: '最低', type: 'min' },
                        { name: '最高', type: 'max' }
                    ]
                },
                markLine: {
                    data: [{ name: '均值', type: 'average' }]
                }
            },
            {
                type: 'line',
                name: '累计净值',
                data: accumNavValues.map((nav, index) => [dates[index], nav]),
                symbolSize: 4,
                showSymbol: true,
                smooth: true,
                lineStyle: {
                    width: 2,
                    color: '#ff6b6b',
                    type: 'dashed'
                }
            }
        ],
        legend: [
            {
                data: ['单位净值', '累计净值'],
                type: 'scroll',
                show: true,
                left: 'center',
                top: '5%'
            }
        ],
        tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: 10
        },
        xAxis: [
            {
                name: '日期',
                type: 'category',
                data: dates,
                axisLabel: {
                    rotate: 45
                },
                splitLine: {
                    show: true
                }
            }
        ],
        yAxis: [
            {
                name: '净值',
                type: 'value',
                splitLine: {
                    show: true
                }
            }
        ],
        toolbox: {
            show: true,
            feature: {
                saveAsImage: { title: '保存图片' },
                dataView: { title: '数据视图' },
                restore: { title: '还原' },
                dataZoom: { title: '区域缩放' }
            }
        }
    };
    
    // 渲染图表
    chart.setOption(option);
    
    // 监听窗口大小变化，调整图表大小
    window.addEventListener('resize', () => {
        chart.resize();
    });
}

// 显示温度图表
async function showTemperatureChart(code, name) {
    // 更新图表状态
    currentChartState = {
        type: 'temperature',
        code: code,
        name: name,
        fundType: null,
        days: currentChartState.days // 使用当前设置的天数
    };
    
    // 显示图表区域
    const chartSection = document.querySelector('.chart-section');
    if (chartSection) {
        chartSection.style.display = 'block';
    }
    
    // 设置图表标题
    const chartTitle = document.getElementById('chartTitle');
    if (chartTitle) {
        chartTitle.textContent = `${name} (${code}) 历史基金温度走势`;
    }
    
    // 更新时间范围按钮的激活状态
    updateTimeButtons(currentChartState.days);
    
    // 加载历史数据
    const historicalData = await loadHistoricalData();
    
    // 检查是否有历史数据
    if (!historicalData[code] || historicalData[code].length === 0) {
        showNotification('暂无该指数的历史温度数据', 'warning');
        return;
    }
    
    // 准备图表数据
    let data = historicalData[code];
    
    // 如果数据点超过当前天数，只显示最近的天数
    if (currentChartState.days > 0 && data.length > currentChartState.days) {
        data = data.slice(-currentChartState.days);
    }
    
    const dates = data.map(item => item.date);
    const temperatures = data.map(item => item.temperature);
    
    // 初始化图表
    const chartContainer = document.getElementById('temperatureChart');
    if (!chartContainer) {
        return;
    }
    
    const chart = echarts.init(chartContainer);
    
    // 设置图表选项
    const option = {
        animation: true,
        animationThreshold: 2000,
        animationDuration: 1000,
        animationEasing: 'cubicOut',
        animationDelay: 0,
        animationDurationUpdate: 300,
        animationEasingUpdate: 'cubicOut',
        animationDelayUpdate: 0,
        series: [
            {
                type: 'line',
                name: name,
                connectNulls: false,
                xAxisIndex: 0,
                symbolSize: 4,
                showSymbol: true,
                smooth: true,
                clip: true,
                step: false,
                data: temperatures.map((temp, index) => [dates[index], temp]),
                hoverAnimation: true,
                label: {
                    show: false,
                    margin: 8,
                    valueAnimation: false
                },
                lineStyle: {
                    show: true,
                    width: 2,
                    opacity: 1,
                    curveness: 0,
                    type: 'solid'
                },
                areaStyle: {
                    opacity: 0
                },
                markPoint: {
                    data: [
                        {
                            name: '最低',
                            type: 'min'
                        },
                        {
                            name: '最高',
                            type: 'max'
                        }
                    ]
                },
                markLine: {
                    silent: false,
                    precision: 2,
                    label: {
                        show: true,
                        margin: 8,
                        valueAnimation: false
                    },
                    data: [
                        {
                            name: '均值',
                            type: 'average'
                        }
                    ]
                }
            }
        ],
        legend: [
            {
                data: [name],
                selected: {},
                type: 'scroll',
                show: true,
                left: 'center',
                top: '5%',
                padding: 5,
                itemGap: 10,
                itemWidth: 25,
                itemHeight: 14
            }
        ],
        tooltip: {
            show: true,
            trigger: 'axis',
            triggerOn: 'mousemove|click',
            axisPointer: {
                type: 'cross'
            },
            showContent: true,
            alwaysShowContent: false,
            showDelay: 0,
            hideDelay: 100,
            enterable: false,
            confine: false,
            appendToBody: false,
            transitionDuration: 0.4,
            textStyle: {
                fontSize: 14
            },
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderWidth: 0,
            padding: 5,
            order: 'seriesAsc'
        },
        xAxis: [
            {
                name: '日期',
                show: true,
                scale: false,
                nameLocation: 'end',
                nameGap: 15,
                axisLabel: {
                    show: true,
                    rotate: 45,
                    margin: 8,
                    valueAnimation: false
                },
                inverse: false,
                offset: 0,
                splitNumber: 5,
                minInterval: 0,
                splitLine: {
                    show: true,
                    lineStyle: {
                        show: true,
                        width: 1,
                        opacity: 1,
                        curveness: 0,
                        type: 'solid'
                    }
                },
                data: dates
            }
        ],
        yAxis: [
            {
                name: '基金温度 (°C)',
                show: true,
                scale: false,
                nameLocation: 'end',
                nameGap: 15,
                axisLabel: {
                    show: true,
                    margin: 8,
                    formatter: '{value}',
                    valueAnimation: false
                },
                inverse: false,
                offset: 0,
                splitNumber: 5,
                minInterval: 0,
                splitLine: {
                    show: true,
                    lineStyle: {
                        show: true,
                        width: 1,
                        opacity: 1,
                        curveness: 0,
                        type: 'solid'
                    }
                }
            }
        ],
        title: [
            {
                show: true,
                target: 'blank',
                subtarget: 'blank',
                padding: 5,
                itemGap: 10,
                textAlign: 'auto',
                textVerticalAlign: 'auto',
                triggerEvent: false
            }
        ],
        toolbox: {
            show: true,
            orient: 'horizontal',
            itemSize: 15,
            itemGap: 10,
            left: '80%',
            feature: {
                saveAsImage: {
                    title: '保存图片'
                },
                dataView: {
                    title: '数据视图',
                    lang: [
                        '数据视图',
                        '关闭',
                        '刷新'
                    ]
                },
                restore: {
                    title: '还原'
                },
                dataZoom: {
                    title: '区域缩放'
                }
            }
        }
    };
    
    // 渲染图表
    chart.setOption(option);
    
    // 监听窗口大小变化，调整图表大小
    window.addEventListener('resize', () => {
        chart.resize();
    });
}

// 更新时间范围按钮的激活状态
function updateTimeButtons(activeDays) {
    const buttons = document.querySelectorAll('.time-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.textContent) === activeDays) {
            btn.classList.add('active');
        }
    });
}

// 切换图表显示天数
async function changeChartDays(days) {
    // 更新当前天数
    currentChartState.days = days;
    
    // 更新按钮状态
    updateTimeButtons(days);
    
    // 根据当前图表类型重新渲染
    if (currentChartState.type === 'nav' && currentChartState.code && currentChartState.fundType) {
        // 重新加载净值图表
        await showFundNavChart(currentChartState.code, currentChartState.fundType);
    } else if (currentChartState.type === 'temperature' && currentChartState.code && currentChartState.name) {
        // 重新加载温度图表
        await showTemperatureChart(currentChartState.code, currentChartState.name);
    }
}

// 关闭图表
function closeChart() {
    const chartSection = document.querySelector('.chart-section');
    chartSection.style.display = 'none';
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

// 判断是否为交易日（周一至周五，排除周末）
function isTradingDay(date) {
    const dayOfWeek = date.getDay();
    // 0 = 周日, 6 = 周六
    return dayOfWeek >= 1 && dayOfWeek <= 5;
}

// 处理CSV文件上传
function handleCSVUpload(input) {
    const file = input.files[0];
    if (!file) return;
    
    // 检查是否为交易日
    const today = new Date();
    if (!isTradingDay(today)) {
        const statusEl = document.getElementById('csvUploadStatus');
        const dayOfWeek = today.getDay();
        const dayName = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][dayOfWeek];
        
        statusEl.innerHTML = `<span style="color: #ff6b6b;">❌ 非交易日（${dayName}）无法上传数据</span>`;
        showNotification('非交易日无法上传数据，请在周一至周五上传', 'warning');
        input.value = '';
        document.getElementById('csvFileName').textContent = '未选择文件';
        return;
    }
    
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
            
            // 获取今天的日期，格式为 YYYY-MM-DD
            const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            
            // 保存数据到localStorage
            localStorage.setItem('csvData', csvText);
            fundsData = parseCSVFull(csvText);
            
            // 创建下载链接，使用当天日期命名
            const blob = new Blob([csvText], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${todayStr}.csv`;
            
            // 渲染表格
            renderFundTable();
            
            showNotification(`${todayStr}.csv 已加载！正在下载...`, 'info');
            
            setTimeout(() => {
                a.click();
                URL.revokeObjectURL(url);
            }, 500);
            
            statusEl.innerHTML = `<span style="color: #51cf66;">✅ ${todayStr}.csv 上传成功，已自动下载</span>`;
        } catch (error) {
            statusEl.innerHTML = `<span style="color: #ff6b6b;">❌ 上传失败：${error.message}</span>`;
            showNotification('上传失败：' + error.message, 'error');
        }
        input.value = '';
        document.getElementById('csvFileName').textContent = '未选择文件';
    };
    reader.readAsText(file);
}
