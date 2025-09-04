import React from "react";

interface TagProps {
    children: React.ReactNode;
}

const Tag = ({children}: TagProps) => {
    return (<span className="bg-secondary px-2 py-1 rounded text-sma cursor-pointer">{children}</span>)
}

export default Tag;