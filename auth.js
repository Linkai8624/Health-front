/**
 * 健康管理系统认证和导航脚本
 * 用于处理登录状态检查和页面跳转逻辑
 */

// 检查登录状态
function checkAuth() {
    // 检查登录状态
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        // 如果未登录，重定向到登录页面
        window.location.href = 'login.html';
        return false;
    }
    
    // 检查用户是否存在
    const username = localStorage.getItem('username');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.some(user => user.username === username);
    
    if (!userExists) {
        // 如果用户不存在，清除登录状态并重定向到登录页面
        logout();
        return false;
    }
    
    // 检查会话是否过期（如果没有设置记住我）
    if (localStorage.getItem('rememberMe') !== 'true') {
        const lastActivity = localStorage.getItem('lastActivity');
        const now = new Date().getTime();
        
        // 如果最后活动时间超过30分钟，则视为会话过期
        if (lastActivity && now - parseInt(lastActivity) > 30 * 60 * 1000) {
            logout();
            alert('会话已过期，请重新登录');
            return false;
        }
        
        // 更新最后活动时间
        localStorage.setItem('lastActivity', now.toString());
    }
    
    return true;
}

// 登出功能
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('lastActivity');
    window.location.href = 'login.html';
}

// 更新用户名显示
function updateUsername() {
    const username = localStorage.getItem('username') || '访客';
    const usernameElements = document.querySelectorAll('.username-display');
    usernameElements.forEach(el => {
        el.textContent = username;
    });
}

// 获取当前用户信息
function getCurrentUser() {
    const username = localStorage.getItem('username');
    if (!username) return null;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(user => user.username === username) || null;
}

// 初始化页面
function initPage() {
    if (!checkAuth()) return;
    
    updateUsername();
    
    // 设置最后活动时间
    localStorage.setItem('lastActivity', new Date().getTime().toString());
    
    // 为所有导航链接添加点击事件
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href !== '#') {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                navigateTo(href);
            });
        }
    });
    
    // 添加登出按钮事件
    const logoutButtons = document.querySelectorAll('.logout-btn');
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', logout);
    });
}

// 页面导航
function navigateTo(page) {
    // 更新最后活动时间
    localStorage.setItem('lastActivity', new Date().getTime().toString());
    window.location.href = page;
}

// 在页面加载完成后初始化
window.addEventListener('DOMContentLoaded', initPage);

// 模拟数据更新效果
function startDataSimulation() {
    setInterval(() => {
        const progressBars = document.querySelectorAll('.progress-value');
        progressBars.forEach(bar => {
            if (bar && bar.style) {
                const currentWidth = parseInt(bar.style.width || '0');
                const newWidth = Math.max(5, Math.min(100, currentWidth + (Math.random() > 0.5 ? 1 : -1)));
                bar.style.width = `${newWidth}%`;
            }
        });
    }, 3000);
}

// 启动数据模拟
window.addEventListener('load', startDataSimulation);

// 监听用户活动，更新最后活动时间
['click', 'keypress', 'scroll', 'mousemove'].forEach(eventType => {
    document.addEventListener(eventType, () => {
        localStorage.setItem('lastActivity', new Date().getTime().toString());
    });
}); 