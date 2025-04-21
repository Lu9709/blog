const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 要扫描的目录
const docsDir = path.join(__dirname, '../docs/repository');

// 忽略的文件和目录
const ignoreFiles = ['.DS_Store', 'index.md'];

// 获取文件的最后Git提交时间
function getLastCommitTime(filePath) {
  try {
    // 使用git log获取文件的最后提交时间
    const gitTime = execSync(
      `git log -1 --format=%at "${filePath}"`,
      { encoding: 'utf-8' }
    ).trim();
    
    // 如果成功获取到时间戳，则返回数字形式的时间戳
    if (gitTime && !isNaN(parseInt(gitTime))) {
      return parseInt(gitTime);
    }
    
    // 如果文件没有提交记录，返回文件的创建时间
    return fs.statSync(filePath).birthtimeMs;
  } catch (error) {
    // 如果出错（例如文件不在git仓库中），返回文件的创建时间
    return fs.statSync(filePath).birthtimeMs;
  }
}

// 生成侧边栏配置
function generateSidebar(dir, basePath = '/repository', existingItems = []) {
  const files = fs.readdirSync(dir);
  const items = [];
  const existingItemsMap = new Map();
  const newItemsMap = new Map(); // 用于存储新项目
  
  // 创建现有项目的映射，以便快速查找
  existingItems.forEach((item, index) => {
    existingItemsMap.set(item.link || (item.text + (item.items ? '-dir' : '')), {
      item,
      index // 保存原始索引位置
    });
  });

  // 处理目录中的文件
  files.forEach(file => {
    if (ignoreFiles.includes(file)) return;
    
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    const relativePath = path.relative(path.join(__dirname, '../docs'), filePath);
    const linkPath = '/' + relativePath.replace(/\\/g, '/').replace(/\.md$/, '');
    
    if (stat.isDirectory()) {
      // 如果是目录，递归处理
      // 查找现有配置中的目录项
      const existingDirInfo = existingItemsMap.get(file + '-dir') || 
                             Array.from(existingItemsMap.values()).find(info => 
                               info.item.text === file && info.item.items);
      
      const existingDirItem = existingDirInfo ? existingDirInfo.item : null;
      const existingIndex = existingDirInfo ? existingDirInfo.index : -1;
      
      const existingSubItems = existingDirItem && existingDirItem.items ? existingDirItem.items : [];
      const subItems = generateSidebar(filePath, `${basePath}/${file}`, existingSubItems);
      
      if (subItems.length > 0) {
        // 获取目录的最后修改时间（使用目录中最新文件的时间）
        const dirLastModified = Math.max(...subItems.map(item => item.lastModified || 0));
        
        // 使用现有配置中的属性（如果存在）
        const newDirItem = {
          text: existingDirItem ? existingDirItem.text : file,
          collapsed: existingDirItem ? existingDirItem.collapsed : true,
          items: subItems,
          lastModified: dirLastModified,
          originalIndex: existingIndex // 保存原始索引
        };
        
        if (existingIndex !== -1) {
          // 如果是现有项目，保留原始索引
          items.push(newDirItem);
        } else {
          // 如果是新项目，先存储起来，稍后添加
          newItemsMap.set(file + '-dir', newDirItem);
        }
      }
    } else if (file.endsWith('.md')) {
      // 如果是 Markdown 文件
      const name = file.replace(/\.md$/, '');
      const lastModified = getLastCommitTime(filePath);
      
      // 查找现有配置中的文件项
      const existingFileInfo = existingItemsMap.get(linkPath) || 
                              Array.from(existingItemsMap.values()).find(info => 
                                info.item.text === name && info.item.link === linkPath);
      
      const existingFileItem = existingFileInfo ? existingFileInfo.item : null;
      const existingIndex = existingFileInfo ? existingFileInfo.index : -1;
      
      // 使用现有配置中的属性（如果存在）
      const newFileItem = {
        text: existingFileItem ? existingFileItem.text : name,
        link: linkPath,
        lastModified: lastModified,
        originalIndex: existingIndex // 保存原始索引
      };
      
      if (existingIndex !== -1) {
        // 如果是现有项目，保留原始索引
        items.push(newFileItem);
      } else {
        // 如果是新项目，先存储起来，稍后添加
        newItemsMap.set(linkPath, newFileItem);
      }
    }
  });

  // 首先按原始索引排序现有项目
  items.sort((a, b) => {
    if (a.originalIndex !== -1 && b.originalIndex !== -1) {
      return a.originalIndex - b.originalIndex;
    } else if (a.originalIndex !== -1) {
      return -1; // 现有项目优先
    } else if (b.originalIndex !== -1) {
      return 1;
    }
    return 0;
  });
  
  // 然后添加新项目（按最后修改时间排序）
  const newItems = Array.from(newItemsMap.values());
  newItems.sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0));
  
  // 合并现有项目和新项目
  const allItems = [...items, ...newItems];
  
  // 返回排序后的项目，但移除lastModified和originalIndex属性
  return allItems.map(item => {
    const { lastModified, originalIndex, ...rest } = item;
    
    // 如果有子项目，也需要移除它们的lastModified和originalIndex属性
    if (rest.items) {
      rest.items = rest.items.map(subItem => {
        const { lastModified, originalIndex, ...subRest } = subItem;
        return subRest;
      });
    }
    
    return rest;
  });
}

// 生成配置并保存到 catalog 目录
function generateAndSaveSidebar() {
  // 创建 catalog 目录（如果不存在）
  const catalogDir = path.join(__dirname, '../catalog');
  if (!fs.existsSync(catalogDir)) {
    fs.mkdirSync(catalogDir, { recursive: true });
  }

  // 尝试读取现有的配置文件
  const outputPath = path.join(catalogDir, 'sidebar-config.json');
  let existingSidebarConfig = {};
  
  if (fs.existsSync(outputPath)) {
    try {
      existingSidebarConfig = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
      console.log('已读取现有侧边栏配置');
    } catch (error) {
      console.error('读取现有侧边栏配置失败:', error);
    }
  }

  // 获取所有顶级目录
  const topDirs = fs.readdirSync(docsDir).filter(dir => {
    const fullPath = path.join(docsDir, dir);
    return fs.statSync(fullPath).isDirectory();
  });

  // 为每个顶级目录生成配置
  const sidebarConfig = {};
  
  topDirs.forEach(dir => {
    const fullPath = path.join(docsDir, dir);
    const sidebarKey = `/repository/${dir}/`;
    
    // 获取现有配置（如果存在）
    const existingConfig = existingSidebarConfig[sidebarKey] || [];
    const existingItems = existingConfig.length > 0 && existingConfig[0].items ? existingConfig[0].items : [];
    
    // 基于现有配置生成新配置
    const items = generateSidebar(fullPath, `/repository/${dir}`, existingItems);
    
    // 格式化为与 config.mts 相同的结构
    sidebarConfig[sidebarKey] = [
      {
        text: existingConfig.length > 0 && existingConfig[0].text ? existingConfig[0].text : dir,
        items: items
      }
    ];
  });

  // 保存配置到文件
  fs.writeFileSync(outputPath, JSON.stringify(sidebarConfig, null, 2), 'utf8');
  
  console.log(`侧边栏配置已生成并保存到: ${outputPath}`);
  return sidebarConfig;
}

// 执行生成
generateAndSaveSidebar();