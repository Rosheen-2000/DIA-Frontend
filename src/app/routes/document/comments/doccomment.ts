export interface DocComment {
    commentid: string;
    creatorname: string;
    creatoravatar: string;
    content: string;
    createtime: string;
    children: DocComment[];
    // lastmodify: string;
    // star: number;
    // alreadystar: boolean;
    // iscreator: boolean;
}