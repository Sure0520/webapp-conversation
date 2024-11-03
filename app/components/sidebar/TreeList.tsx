import React, { useState } from 'react';
import type { FC } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Checkbox as MuiCheckbox } from '@mui/material';

interface TreeNode {
    id: string;
    name: string;
    children?: TreeNode[];
}

interface TreeListProps {
    nodes?: TreeNode[];
    onNodeClick: (id: string) => void;
}

const TreeList: FC<TreeListProps> = ({ nodes = [], onNodeClick }) => {
    const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
    const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

    const toggleNode = (nodeId: string) => {
        setExpandedNodes((prevExpandedNodes) =>
            prevExpandedNodes.includes(nodeId)
                ? prevExpandedNodes.filter((id) => id !== nodeId)
                : [...prevExpandedNodes, nodeId]
        );
    };

    const handleCheckboxChange = (nodeId: string) => {
        setSelectedNodes((prevSelectedNodes) =>
            prevSelectedNodes.includes(nodeId)
                ? prevSelectedNodes.filter((id) => id !== nodeId)
                : [...prevSelectedNodes, nodeId]
        );
    };

    const renderNode = (node: TreeNode, level = 0) => {
        const padding = level * 16; // 每级缩进 16px
        const isExpanded = expandedNodes.includes(node.id);
        const isSelected = selectedNodes.includes(node.id);

        return (
            <div key={node.id} style={{ paddingLeft: padding }} className="group flex items-center rounded-md px-2 py-2 text-sm font-medium cursor-pointer text-gray-700 hover:bg-gray-100 hover:text-gray-700">
                <ChevronRightIcon
                    className={`mr-2 h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-gray-500 ${isExpanded ? 'rotate-90' : ''}`}
                    aria-hidden="true"
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleNode(node.id);
                    }}
                />
                <MuiCheckbox
                    checked={isSelected}
                    onChange={() => handleCheckboxChange(node.id)}
                    className="mr-2 h-4 w-4 flex-shrink-0 text-blue-600"
                />
                <span onClick={() => onNodeClick(node.id)}>{node.name}</span>
                {node.children && node.children.length > 0 && (
                    <div className="ml-4" style={{ display: isExpanded ? 'block' : 'none' }}>
                        {node.children.map(child => renderNode(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <nav className="space-y-1 bg-white p-4 !pt-0">
            {nodes.map(node => renderNode(node))}
        </nav>
    );
};

export default TreeList;