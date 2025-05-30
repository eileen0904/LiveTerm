export const virtualFS: Record<string, string[]> = {
    '/': ['projects', 'MyResume.pdf', 'about.txt', 'school', 'skills.txt'],
    '/school': [
        'Master   : National Central University - CSIE',
        'Bachelor : National Dong Hwa University - CSIE',
    ],
    '/projects': [],
};

export let currentPath = '/';

// 儲存 repo 名稱與網址對應（用於 cat 指令）
export const projectMap: Record<string, string> = {};

export const setCurrentPath = (path: string) => {
    currentPath = path;
};

export const getCurrentPath = () => currentPath;
