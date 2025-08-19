// 全局变量
let currentSection = 'knowledge';
let currentCellType = 'animal';
let currentChromosomeType = '2n=4';
let currentPhase = 'prophase';
let autoPlayInterval = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSimulator();
    drawQuantityChart();
});

// 导航功能
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // 更新按钮状态
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 切换章节
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetSection).classList.add('active');
            
            currentSection = targetSection;
        });
    });
}

// 更新染色体组成选项
function updateChromosomeOptions() {
    const chromosomeTypeSelect = document.getElementById('chromosomeType');
    
    // 定义不同细胞类型的选项
    const optionsMap = {
        animal: [
            { value: '2n=4', text: '2n=4 (二倍体，4条染色体)' }
        ],
        plant: [
            { value: '2n=6', text: '2n=6 (二倍体，6条染色体)' },
            { value: '3n=6', text: '3n=6 (三倍体，6条染色体)' }
        ]
    };
    
    // 获取当前细胞类型的选项
    const currentOptions = optionsMap[currentCellType];
    
    // 清空并重新填充选项
    chromosomeTypeSelect.innerHTML = '';
    currentOptions.forEach(opt => {
        const optionElement = document.createElement('option');
        optionElement.value = opt.value;
        optionElement.textContent = opt.text;
        chromosomeTypeSelect.appendChild(optionElement);
    });
    
    // 更新当前染色体类型为新列表的第一个
    currentChromosomeType = chromosomeTypeSelect.value;
}

// 模拟器初始化
function initializeSimulator() {
    const cellTypeSelect = document.getElementById('cellType');
    const chromosomeTypeSelect = document.getElementById('chromosomeType');
    const phaseSelect = document.getElementById('phase');
    const autoPlayBtn = document.getElementById('autoPlay');
    const prevBtn = document.getElementById('prevStep');
    const nextBtn = document.getElementById('nextStep');
    
    // 检查元素是否存在
    if (!cellTypeSelect || !chromosomeTypeSelect || !phaseSelect || !autoPlayBtn) {
        console.warn('某些控制元素未找到，跳过初始化');
        return;
    }
    
    // 绑定事件监听器
    cellTypeSelect.addEventListener('change', function() {
        currentCellType = this.value;
        updateChromosomeOptions();
        updateSimulation();
    });
    
    chromosomeTypeSelect.addEventListener('change', function() {
        currentChromosomeType = this.value;
        updateSimulation();
    });
    
    phaseSelect.addEventListener('change', function() {
        currentPhase = this.value;
        updateSimulation();
        updateNavigationButtons();
    });
    
    autoPlayBtn.addEventListener('click', function() {
        if (autoPlayInterval) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    });
    
    // 添加上一步/下一步按钮事件
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            navigatePhase(-1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            navigatePhase(1);
        });
    }
    
    // 初始化显示
    updateChromosomeOptions();
    updateSimulation();
    updateNavigationButtons();
    
    // 添加模拟器控制按钮的事件监听
    initializeSimulatorControls();
}

// 初始化模拟器控制按钮
function initializeSimulatorControls() {
    const simPrevBtn = document.getElementById('simPrevStep');
    const simNextBtn = document.getElementById('simNextStep');
    const simAutoPlayBtn = document.getElementById('simAutoPlay');
    
    if (simPrevBtn) {
        simPrevBtn.addEventListener('click', function() {
            navigatePhase(-1);
        });
    }
    
    if (simNextBtn) {
        simNextBtn.addEventListener('click', function() {
            navigatePhase(1);
        });
    }
    
    if (simAutoPlayBtn) {
        simAutoPlayBtn.addEventListener('click', function() {
            if (autoPlayInterval) {
                stopSimAutoPlay();
            } else {
                startSimAutoPlay();
            }
        });
    }
}

// 更新模拟显示
function updateSimulation() {
    updateCellImage();
    updatePhaseInfo();
    updateQuantityStats();
}

// 更新细胞图像
function updateCellImage() {
    const cellImageDiv = document.getElementById('cellImage');
    const imagePath = `assets/${currentCellType === 'animal' ? '动物' : '植物'}/${currentChromosomeType}/${getPhaseFileName()}.svg`;
    
    // 创建图像容器
    cellImageDiv.innerHTML = `
        <div class="image-container">
            <img src="${imagePath}" alt="${getPhaseTitle()}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
        </div>
    `;
}

// 获取时期文件名
function getPhaseFileName() {
    const phaseMap = {
        'prophase': '前期',
        'metaphase': '中期',
        'anaphase': '后期',
        'telophase': '末期'
    };
    return phaseMap[currentPhase];
}

// 获取时期标题
function getPhaseTitle() {
    const titleMap = {
        'prophase': '前期 (Prophase)',
        'metaphase': '中期 (Metaphase)',
        'anaphase': '后期 (Anaphase)',
        'telophase': '末期 (Telophase)'
    };
    return titleMap[currentPhase];
}

// 更新时期信息
function updatePhaseInfo() {
    const phaseTitle = document.getElementById('phaseTitle');
    const phaseDescription = document.getElementById('phaseDescription');
    
    phaseTitle.textContent = getPhaseTitle();
    phaseDescription.innerHTML = getPhaseDescription();
}

// 获取时期描述
function getPhaseDescription() {
    const cellTypeText = currentCellType === 'animal' ? '动物细胞' : '植物细胞';
    const descriptions = {
        'prophase': `
            <div class="phase-analogy">
                <h4>🎭 生活类比：</h4>
                <p>就像演员在后台准备上台表演一样，细胞内的"演员"（染色体）正在整理装扮，准备登台亮相！</p>
            </div>
            <h4>🔬 主要特征：</h4>
            <ul>
                <li>🧬 <strong>染色质螺旋化</strong>：原本松散的染色质像毛线团一样紧紧缠绕，形成粗短的染色体，就像把长绳子卷成小团方便携带</li>
                <li>💫 <strong>核膜核仁消失</strong>：细胞核的"围墙"（核膜）和"工厂"（核仁）逐渐拆除，为染色体的移动让路</li>
                <li>🌟 <strong>纺锤体形成</strong>：${currentCellType === 'animal' ? '中心体像两个指挥官分别走向细胞两端，' : ''}开始搭建"运输轨道"（纺锤体）</li>
                <li>📍 <strong>姐妹染色单体</strong>：每条染色体都像连体双胞胎，通过着丝粒这个"纽扣"连在一起</li>
            </ul>
            <div class="precise-definition">
                <h4>📚 精确定义：</h4>
                <p>前期是有丝分裂的第一阶段，染色质高度螺旋化形成染色体，核膜和核仁解体，纺锤体开始组装。此时每条染色体由两条通过着丝粒连接的姐妹染色单体组成。</p>
            </div>
            <p><strong>🎯 记忆口诀：</strong>"膜仁消失，两体出现"</p>
            <p><strong>🔬 细胞类型：</strong>${cellTypeText}</p>
        `,
        'metaphase': `
            <div class="phase-analogy">
                <h4>🎭 生活类比：</h4>
                <p>就像军队检阅时所有士兵整齐排列在广场中央一样，染色体们也在细胞中央排成一条整齐的队伍！</p>
            </div>
            <h4>🔬 主要特征：</h4>
            <ul>
                <li>⚖️ <strong>赤道板排列</strong>：所有染色体的着丝粒都精确排列在细胞中央的假想平面上，就像珠子串在一条看不见的线上</li>
                <li>🎯 <strong>形态最清晰</strong>：染色体此时最"上镜"，形态稳定清晰，是科学家观察和拍照的最佳时机</li>
                <li>🔗 <strong>纺锤丝连接</strong>：每个着丝粒就像一个"挂钩"，两侧都有来自细胞两极的"绳子"（纺锤丝）牵着</li>
                <li>📊 <strong>计数分析</strong>：就像点名一样，此时最容易准确统计染色体数目和分析染色体结构</li>
            </ul>
            <div class="precise-definition">
                <h4>📚 精确定义：</h4>
                <p>中期是染色体着丝粒排列在细胞中央赤道板上的阶段。纺锤体完全形成，每个着丝粒的两侧都有纺锤丝附着，为后续的染色体分离做准备。</p>
            </div>
            <p><strong>🎯 记忆口诀：</strong>"形定数清，赤道排列"</p>
            <p><strong>🔬 细胞类型：</strong>${cellTypeText}</p>
        `,
        'anaphase': `
            <div class="phase-analogy">
                <h4>🎭 生活类比：</h4>
                <p>就像拉链被拉开一样，原本连在一起的姐妹染色单体突然分开，各自奔向细胞的两端，就像两队人马分别回到自己的营地！</p>
            </div>
            <h4>🔬 主要特征：</h4>
            <ul>
                <li>✂️ <strong>着丝粒分裂</strong>：连接姐妹染色单体的"纽扣"（着丝粒）一分为二，这是后期最关键的"开关"事件</li>
                <li>🏃‍♂️ <strong>染色单体分离</strong>：原本的"连体双胞胎"分家了，各自成为独立的染色体，奔向细胞两极</li>
                <li>📈 <strong>数目暂时加倍</strong>：因为分离，染色体数目从2N瞬间变成4N，就像一个班级突然分成两个班</li>
                <li>🎯 <strong>同步移动</strong>：所有子染色体都以相同速度移动，确保分配的公平性</li>
            </ul>
            <div class="precise-definition">
                <h4>📚 精确定义：</h4>
                <p>后期的标志是着丝粒分裂，姐妹染色单体分离成为独立的子染色体，在纺锤丝牵引下向细胞两极移动。此时细胞内染色体数目暂时加倍。</p>
            </div>
            <p><strong>🎯 记忆口诀：</strong>"点裂数增，均分两极"</p>
            <p><strong>🔬 细胞类型：</strong>${cellTypeText}</p>
        `,
        'telophase': `
            <div class="phase-analogy">
                <h4>🎭 生活类比：</h4>
                <p>就像演出结束后演员们回到各自的化妆间，脱下演出服装一样，染色体们也回到各自的"房间"，恢复日常的松散状态！</p>
            </div>
            <h4>🔬 主要特征：</h4>
            <ul>
                <li>🧬 <strong>染色体解螺旋</strong>：紧密卷曲的染色体开始"放松"，重新变成细长的染色质丝，就像把卷起的毛线重新展开</li>
                <li>🔄 <strong>核膜核仁重建</strong>：在细胞两极重新搭建"围墙"（核膜）和"工厂"（核仁），为两个新细胞核做准备</li>
                <li>💫 <strong>纺锤体消失</strong>：完成使命的"运输轨道"（纺锤体）开始拆除</li>
                <li>✂️ <strong>胞质分裂开始</strong>：${currentCellType === 'animal' ? '细胞膜开始向内凹陷形成"腰带"（分裂沟）' : '在细胞中央开始建造新的"隔墙"（细胞板）'}</li>
            </ul>
            <div class="precise-definition">
                <h4>📚 精确定义：</h4>
                <p>末期是染色体解螺旋、核膜和核仁重新形成的阶段。纺锤体解体，胞质开始分裂，最终形成两个遗传物质相同的子细胞。</p>
            </div>
            <p><strong>🎯 记忆口诀：</strong>"两体消失，膜仁重建"</p>
            <p><strong>🔬 细胞类型：</strong>${cellTypeText}</p>
        `
    };
    
    return descriptions[currentPhase];
}

// 导航功能
function navigatePhase(direction) {
    const phases = ['prophase', 'metaphase', 'anaphase', 'telophase'];
    const currentIndex = phases.indexOf(currentPhase);
    let newIndex = currentIndex + direction;
    
    // 循环导航
    if (newIndex < 0) newIndex = phases.length - 1;
    if (newIndex >= phases.length) newIndex = 0;
    
    currentPhase = phases[newIndex];
    const phaseSelect = document.getElementById('phase');
    if (phaseSelect) {
        phaseSelect.value = currentPhase;
    }
    updateSimulation();
    updateNavigationButtons();
}

// 更新导航按钮状态
function updateNavigationButtons() {
    const phases = ['prophase', 'metaphase', 'anaphase', 'telophase'];
    const currentIndex = phases.indexOf(currentPhase);
    const prevBtn = document.getElementById('prevStep');
    const nextBtn = document.getElementById('nextStep');
    
    if (prevBtn && nextBtn) {
        // 移除禁用状态，允许循环导航
        prevBtn.disabled = false;
        nextBtn.disabled = false;
        
        // 更新按钮文本显示当前位置
        prevBtn.innerHTML = `⏮️ 上一步 (${currentIndex + 1}/4)`;
        nextBtn.innerHTML = `⏭️ 下一步 (${currentIndex + 1}/4)`;
    }
}

// 更新数量统计
function updateQuantityStats() {
    const chromosomeCount = document.getElementById('chromosomeCount');
    const dnaCount = document.getElementById('dnaCount');
    const chromatidCount = document.getElementById('chromatidCount');
    
    const stats = getQuantityStats();
    
    chromosomeCount.textContent = stats.chromosomes;
    dnaCount.textContent = stats.dna;
    chromatidCount.textContent = stats.chromatids;
}

// 获取数量统计
function getQuantityStats() {
    // 解析染色体类型
    let baseNumber;
    let ploidy;
    
    if (currentChromosomeType === '2n=4') {
        baseNumber = 2; // n=2
        ploidy = 2; // 二倍体
    } else if (currentChromosomeType === '2n=6') {
        baseNumber = 3; // n=3
        ploidy = 2; // 二倍体
    } else if (currentChromosomeType === '3n=6') {
        baseNumber = 2; // n=2
        ploidy = 3; // 三倍体
    }
    
    const totalChromosomes = baseNumber * ploidy;
    
    let chromosomes, dna, chromatids;
    
    // 根据分裂时期计算数量
    switch (currentPhase) {
        case 'prophase':
        case 'metaphase':
            chromosomes = totalChromosomes;
            dna = totalChromosomes * 2; // 每条染色体有2个DNA分子
            chromatids = totalChromosomes * 2; // 每条染色体有2条染色单体
            break;
            
        case 'anaphase':
            chromosomes = totalChromosomes * 2; // 着丝粒分裂，数目加倍
            dna = totalChromosomes * 2; // DNA总数不变
            chromatids = 0; // 染色单体消失
            break;
            
        case 'telophase':
            chromosomes = `${totalChromosomes * 2} → ${totalChromosomes}/细胞`;
            dna = `${totalChromosomes * 2} → ${totalChromosomes}/细胞`;
            chromatids = 0;
            break;
    }
    
    return {
        chromosomes: chromosomes,
        dna: dna,
        chromatids: chromatids
    };
}

// 自动播放功能
function startAutoPlay() {
    const phases = ['prophase', 'metaphase', 'anaphase', 'telophase'];
    const autoPlayBtn = document.getElementById('autoPlay');
    const phaseSelect = document.getElementById('phase');
    
    if (!autoPlayBtn || !phaseSelect) return;
    
    autoPlayBtn.textContent = '⏸️ 暂停播放';
    autoPlayBtn.classList.add('playing');
    
    let currentIndex = phases.indexOf(currentPhase);
    
    autoPlayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % phases.length;
        currentPhase = phases[currentIndex];
        phaseSelect.value = currentPhase;
        updateSimulation();
        updateNavigationButtons();
    }, 3000); // 每3秒切换一次
}

function stopAutoPlay() {
    const autoPlayBtn = document.getElementById('autoPlay');
    
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
    
    if (autoPlayBtn) {
        autoPlayBtn.textContent = '🎬 自动播放';
        autoPlayBtn.classList.remove('playing');
    }
}

// 模拟器专用自动播放功能
function startSimAutoPlay() {
    const phases = ['prophase', 'metaphase', 'anaphase', 'telophase'];
    const simAutoPlayBtn = document.getElementById('simAutoPlay');
    const simPlayIcon = document.getElementById('simPlayIcon');
    const simPlayText = document.getElementById('simPlayText');
    const phaseSelect = document.getElementById('phase');
    
    if (!simAutoPlayBtn || !phaseSelect) return;
    
    simAutoPlayBtn.classList.add('playing');
    if (simPlayIcon) simPlayIcon.textContent = '⏸️';
    if (simPlayText) simPlayText.textContent = '暂停';
    
    let currentIndex = phases.indexOf(currentPhase);
    
    autoPlayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % phases.length;
        currentPhase = phases[currentIndex];
        phaseSelect.value = currentPhase;
        updateSimulation();
        updateNavigationButtons();
    }, 3000); // 每3秒切换一次
}

function stopSimAutoPlay() {
    const simAutoPlayBtn = document.getElementById('simAutoPlay');
    const simPlayIcon = document.getElementById('simPlayIcon');
    const simPlayText = document.getElementById('simPlayText');
    
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
    
    if (simAutoPlayBtn) {
        simAutoPlayBtn.classList.remove('playing');
        if (simPlayIcon) simPlayIcon.textContent = '▶️';
        if (simPlayText) simPlayText.textContent = '播放';
    }
}

// 修复图表绘制函数，添加错误检查
function drawQuantityChart() {
    const canvas = document.getElementById('quantityChart');
    if (!canvas) {
        console.warn('图表画布未找到');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.warn('无法获取画布上下文');
        return;
    }
    
    // 设置画布尺寸
    const width = canvas.width;
    const height = canvas.height;
    
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    
    // 设置样式
    ctx.font = '14px "Noto Sans SC", sans-serif';
    ctx.lineWidth = 3;
    
    // 数据点（以2n=4为例）
    const phases = ['G1期', 'S期', 'G2期', '前期', '中期', '后期', '末期'];
    const chromosomeData = [4, 4, 4, 4, 4, 8, 4]; // 染色体数
    const dnaData = [4, 8, 8, 8, 8, 8, 4]; // DNA数
    const chromatidData = [0, 4, 8, 8, 8, 0, 0]; // 染色单体数
    
    // 计算绘图区域
    const padding = 60;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    // 绘制坐标轴
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // 绘制网格线和Y轴标签
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 8; i++) {
        const y = height - padding - (i / 8) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
        
        // Y轴标签
        ctx.fillStyle = '#666';
        ctx.textAlign = 'right';
        ctx.fillText(i.toString(), padding - 10, y + 5);
    }
    
    // 绘制X轴标签
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    phases.forEach((phase, index) => {
        const x = padding + (index / (phases.length - 1)) * chartWidth;
        ctx.fillText(phase, x, height - padding + 25);
    });
    
    // 绘制数据线函数
    function drawLine(data, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        data.forEach((value, index) => {
            const x = padding + (index / (phases.length - 1)) * chartWidth;
            const y = height - padding - (value / 8) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // 绘制数据点
        ctx.fillStyle = color;
        data.forEach((value, index) => {
            const x = padding + (index / (phases.length - 1)) * chartWidth;
            const y = height - padding - (value / 8) * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();
        });
    }
    
    // 绘制三条线
    drawLine(chromosomeData, '#ff6b6b'); // 染色体数
    drawLine(dnaData, '#4ecdc4'); // DNA数
    drawLine(chromatidData, '#45b7d1'); // 染色单体数
    
    // 添加标题
    ctx.fillStyle = '#333';
    ctx.font = '16px "Noto Sans SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('有丝分裂过程中数量变化图 (以2n=4为例)', width / 2, 30);
    
    // Y轴标题
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('数量', 0, 0);
    ctx.restore();
}

// 绘制数量变化图表
function drawQuantityChart() {
    const canvas = document.getElementById('quantityChart');
    const ctx = canvas.getContext('2d');
    
    // 设置画布尺寸
    const width = canvas.width;
    const height = canvas.height;
    
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    
    // 设置样式
    ctx.font = '14px "Noto Sans SC", sans-serif';
    ctx.lineWidth = 3;
    
    // 数据点（以2n=4为例）
    const phases = ['G1期', 'S期', 'G2期', '前期', '中期', '后期', '末期'];
    const chromosomeData = [4, 4, 4, 4, 4, 8, 4]; // 染色体数
    const dnaData = [4, 8, 8, 8, 8, 8, 4]; // DNA数
    const chromatidData = [0, 4, 8, 8, 8, 0, 0]; // 染色单体数
    
    // 计算绘图区域
    const padding = 60;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    // 绘制坐标轴
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // 绘制网格线
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 8; i++) {
        const y = height - padding - (i / 8) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
        
        // Y轴标签
        ctx.fillStyle = '#666';
        ctx.textAlign = 'right';
        ctx.fillText(i.toString(), padding - 10, y + 5);
    }
    
    // 绘制X轴标签
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    phases.forEach((phase, index) => {
        const x = padding + (index / (phases.length - 1)) * chartWidth;
        ctx.fillText(phase, x, height - padding + 25);
    });
    
    // 绘制数据线
    function drawLine(data, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        data.forEach((value, index) => {
            const x = padding + (index / (phases.length - 1)) * chartWidth;
            const y = height - padding - (value / 8) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // 绘制数据点
        ctx.fillStyle = color;
        data.forEach((value, index) => {
            const x = padding + (index / (phases.length - 1)) * chartWidth;
            const y = height - padding - (value / 8) * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();
        });
    }
    
    // 绘制三条线
    drawLine(chromosomeData, '#ff6b6b'); // 染色体数
    drawLine(dnaData, '#4ecdc4'); // DNA数
    drawLine(chromatidData, '#45b7d1'); // 染色单体数
    
    // 添加标题
    ctx.fillStyle = '#333';
    ctx.font = '16px "Noto Sans SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('有丝分裂过程中数量变化图 (以2n=4为例)', width / 2, 30);
    
    // Y轴标题
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('数量', 0, 0);
    ctx.restore();
}

// 添加交互提示
function addTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.classList.add('tooltip');
        });
        
        element.addEventListener('mouseleave', function() {
            this.classList.remove('tooltip');
        });
    });
}

// 添加键盘快捷键支持
document.addEventListener('keydown', function(event) {
    if (currentSection === 'simulator') {
        const phases = ['prophase', 'metaphase', 'anaphase', 'telophase'];
        const currentIndex = phases.indexOf(currentPhase);
        
        switch(event.key) {
            case 'ArrowLeft':
                if (currentIndex > 0) {
                    currentPhase = phases[currentIndex - 1];
                    document.getElementById('phase').value = currentPhase;
                    updateSimulation();
                }
                break;
            case 'ArrowRight':
                if (currentIndex < phases.length - 1) {
                    currentPhase = phases[currentIndex + 1];
                    document.getElementById('phase').value = currentPhase;
                    updateSimulation();
                }
                break;
            case ' ':
                event.preventDefault();
                document.getElementById('autoPlay').click();
                break;
        }
    }
});

// 页面离开时清理定时器
window.addEventListener('beforeunload', function() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
    }
});