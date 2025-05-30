// List of commands that do not require API calls

import * as bin from './index';
import config from '../../../config.json';
import { getProjects } from '../api';
import { getCurrentPath, virtualFS, projectMap, setCurrentPath } from './fs';
export { neofetch } from './neofetch'; 

// Help
export const help = async (args: string[]): Promise<string> => {
  const c = Object.keys(bin).sort().join('\n');

  return `Welcome! Here are all the available commands:
\n${c}\n
[tab]: trigger completion.
[ctrl+l]/clear: clear terminal.\n
Type 'sumfetch' to display summary.
`;
};

// Redirection
export const repo = async (args: string[]): Promise<string> => {
  window.open(`${config.repo}`);
  return 'Opening Github repository...';
};

// About
export const about = async (args: string[]): Promise<string> => {
  return `Hi, I am ${config.name}. 
Welcome to my website!
More about me:
'sumfetch' - short summary.
'resume' - my latest resume.`;
};

export const resume = async (args: string[]): Promise<string> => {
  window.open(`${config.resume_url}`);
  return 'Opening resume...';
};

export const school = async (args: string[]) : Promise<string> => {
  return `Master   : National Central University - CSIE\nBachelor : National Dong Hwa University - CSIE`;
};

export const experience = async (args: string[]): Promise<string> => {
  return `Software Engineer Intern @ FitTech (2023)`;
};

export const language = async (args: string[]) : Promise<string> => {
  return `Chinese, English`;
};

export const skills = async (args: string[]) : Promise<string> => {
  return `C, C++, C#, Java, Python, Linux, Git, Docker`;
};

export const quote = async (): Promise<string> => {
  return `"May the force be with you."`;
};

// Contact
export const email = async (args: string[]): Promise<string> => {
  window.open(`mailto:${config.email}`);
  return `Opening mailto:${config.email}...`;
};

export const github = async (args: string[]): Promise<string> => {
  window.open(`https://github.com/${config.social.github}/`);

  return 'Opening github...';
};

// Search
export const google = async (args: string[]): Promise<string> => {
  window.open(`https://google.com/search?q=${args.join(' ')}`);
  return `Searching google for ${args.join(' ')}...`;
};

// Typical linux commands
export const echo = async (args: string[]): Promise<string> => {
  return args.join(' ');
};

export const whoami = async (args: string[]): Promise<string> => {
  return `${config.ps1_username}`;
};

export const ls = async (): Promise<string> => {
  const path = getCurrentPath();
  const items = virtualFS[path];
  return Array.isArray(items) ? items.join('  \n') : 'no such directory';
};

export const cd = async (args: string[]): Promise<string> => {
  if (args.length === 0) return 'usage: cd <directory>';
  const current = getCurrentPath();
  const target = args[0];

  if (target === '..') {
    if (current === '/') return 'Already at root';
    const parent = current.split('/').slice(0, -1).join('/') || '/';

    // 清空 /projects 當使用者離開它
    if (current === '/projects' && virtualFS['/projects']) {
      virtualFS['/projects'] = [];
      // 同時清空 projectMap 內容
      for (const key in projectMap) {
        delete projectMap[key];
      }
    }

    setCurrentPath(parent);
    return `Moved to ${parent}`;
  }

  const newPath = current === '/' ? `/${target}` : `${current}/${target}`;
  if (virtualFS[newPath]) {
    setCurrentPath(newPath);

    // 如果是 cd projects，動態填入 github repo
    if (newPath === '/projects') {
      const repos = await getProjects();

      virtualFS['/projects'] = repos.map((repo) => repo.name);

      // 清空 projectMap
      for (const key in projectMap) {
        delete projectMap[key];
      }

      // 填入新的 repo url
      for (const repo of repos) {
        projectMap[repo.name] = repo.html_url;
      }
    }

    return `Entered ${newPath}`;
  } else {
    return `cd: no such directory: ${target}`;
  }
};

export const cat = async (args: string[]): Promise<string> => {
  if (args.length === 0) return 'usage: cat <filename>';
  const current = getCurrentPath();
  const file = args[0];

  const files = virtualFS[current];
  if (!files || !files.includes(file)) {
    return `cat: ${file}: No such file`;
  }

  if (file === 'MyResume.pdf') {
    window.open(`${config.resume_url}`);
    return `Opening resume...`;
  }

  // 如果在 /projects，顯示對應的 repo URL
  if (current === '/projects' && projectMap[file]) {
    return `${file} - <a class="text-light-blue dark:text-dark-blue underline" href="${projectMap[file]}" target="_blank">${projectMap[file]}</a>`;
  }

  if (file === 'about.txt') {
    return `Hi, I am ${config.name}. 
Welcome to my website!
More about me:
'sumfetch' - short summary.
'resume' - my latest resume.`;
  }

  if (file === 'skills.txt') {
    return `C, C++, C#, Java, Python, Linux, Git, Docker`;
  }

  return 'This file has no content.';
};

export const pwd = async (): Promise<string> => {
  return getCurrentPath();
};

export const ifconfig = async (): Promise<string> => {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    if (!res.ok) throw new Error('Failed to fetch IP');
    const data = await res.json();
    return `Your public IP address is: ${data.ip}`;
  } catch (error) {
    return 'Unable to fetch IP address.';
  }
};

export const who = async (): Promise<string> => {
  const username = config.ps1_username;
  const time = new Date().toString();

  let ip = await ifconfig();
  const browser = navigator.userAgent;

  return `User: ${username}
Time: ${time}
${ip}
Browser: ${browser}`;
};

export const setname = async (args: string[]): Promise<string> => {
  if (args.length === 0) return 'Usage: setname <your_name>';
  const name = args.join(' ');
  localStorage.setItem('username', name);
  config.ps1_username = name;
  return `Username set to ${name}`;
};

export const date = async (args: string[]): Promise<string> => {
  return new Date().toString();
};

export const sudo = async (args?: string[]): Promise<string> => {
  window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank'); // ...I'm sorry
  return `Permission denied: with little power comes... no responsibility? `;
};

// Matrix Rain
export const matrix = async (): Promise<string> => {
  const event = new CustomEvent('matrixStart');
  window.dispatchEvent(event);
  return 'Wake up, Neo...';
};

// Banner
export const banner = (args?: string[]): string => {
  return `
 ███████████ █████                                            ████   ███
░█░░░███░░░█░░███                                            ░░███  ░░░
░   ░███  ░  ░███████    ██████  ████████   ██████   ██████   ░███  ████  ████████    ███████
    ░███     ░███░░███  ███░░███░░███░░███ ███░░███ ░░░░░███  ░███ ░░███ ░░███░░███  ███░░███
    ░███     ░███ ░███ ░███████  ░███ ░░░ ░███████   ███████  ░███  ░███  ░███ ░███ ░███ ░███
    ░███     ░███ ░███ ░███░░░   ░███     ░███░░░   ███░░███  ░███  ░███  ░███ ░███ ░███ ░███
    █████    ████ █████░░██████  █████    ░░██████ ░░████████ █████ █████ ████ █████░░███████
   ░░░░░    ░░░░ ░░░░░  ░░░░░░  ░░░░░      ░░░░░░   ░░░░░░░░ ░░░░░ ░░░░░ ░░░░ ░░░░░  ░░░░░███
                                                                                     ███ ░███
                                                                                    ░░██████
                                                                                     ░░░░░░

Type 'help' to see the list of available commands.
Type 'sumfetch' to display summary.
Type 'repo' or click <u><a class="text-light-blue dark:text-dark-blue underline" href="${config.repo}" target="_blank">here</a></u> for the Github repository.
`;
};
