import config from '../../../config.json';

export const neofetch = async (): Promise<string> => {
    const ua = navigator.userAgent;

    // 偵測作業系統
    const os = (() => {
        if (ua.includes('Win')) return 'Windows';
        if (ua.includes('Mac')) return 'macOS';
        if (ua.includes('Linux')) return 'Linux';
        if (ua.includes('X11')) return 'UNIX';
        return 'Unknown';
    })();

    // 偵測瀏覽器
    const browser = (() => {
        if (ua.includes('Edg')) return 'Edge';
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
        if (ua.includes('Firefox')) return 'Firefox';
        return 'Unknown';
    })();

    // 偵測版本
    const versionMatch = ua.match(/(Chrome|Firefox|Safari|Edg)\/([\d.]+)/);
    const version = versionMatch ? versionMatch[2] : 'Unknown';

    const username = config.ps1_username;

    return `
${username}@therealing.com
-------------------------
OS: ${os}
Browser: ${browser} ${version}
Shell: Therealing v1.0
Theme: Dracula`;
};

//config.ps1_username