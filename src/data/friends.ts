// src/data/friends.ts

export interface Friend {
  name: string;
  desc: string;
  avatar: string; // 图片链接
  url: string;    // 跳转链接
  color?: string; // (可选) 卡片强调色，暂时保留接口
}

export const friendsData: Friend[] = [
    { 
    name: "風雪城", 
    desc: "浩繁星空下的一场稚嫩的梦", 
    avatar: "https://imgsrc.chyk.ink/8mQ9M-dZdj9pJaTx.webp",
    url: "https://blog.chyk.ink/"
    },
    { 
    name: "MBRjun-Blog", 
    desc: "我们生活在大地上，但我们的梦想超越天空", 
    avatar: "https://lfs.libmbr.com/assets/pics/LG4v5Ravatar180px.webp",
    url: "https://www.libmbr.com/"
  }
];