export interface DocInfo {
    docid: string;
    title: string;
    author: string;
    firstmodify: string;
    lastmodify: string;
    modifytimes: number;
    lastvisit: string;
    team: string;
    // 当前用户对本文档的访问权限
    accessment: number;
}