"use client";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Edit, Plus, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IMenu } from "../../../types/menu";
import { RootState, useAppDispatch } from "../store";
import {
  fetchTreeData,
  setSelectedTree,
  setType,
} from "../store/slices/treeSlice";

const TreeNode: React.FC<{
  node: IMenu;
  expandedNodes: Set<string>;
  toggleNode: (name: string) => void;
}> = ({ node, expandedNodes, toggleNode }) => {
  const isExpanded = expandedNodes.has(node.name);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useAppDispatch();
  const isLastChild = !node.children?.length;
  const [loading, setLoading] = useState(false);

  const deleteNode = async () => {
    setLoading(true);
    const response = await fetch("/api/delete-menu", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: node?.id }),
    });
    if (!response.ok) {
      throw new Error("Failed to edit menu");
    }
    dispatch(fetchTreeData());
    setTimeout(() => {
      setLoading(false);
    }, 2000)
  };
  return (
    <div className="ml-4">
      {
        loading ? (
          <p>...Deleting</p>
        ) : (
          <>
            <div
              className="flex items-center space-x-2 w-max"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div
                onClick={() => toggleNode(node.name)}
                className="text-left  flex items-center space-x-2 focus:outline-none h-8"
              >
                {node.children && (
                  <span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </span>
                )}
                <span>{node.name}</span>
              </div>
              {isHovered && (
                <span className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="smallIcon"
                    className="hover:bg-arctic-blue bg-arctic-blue rounded-full"
                    onClick={() => {
                      dispatch(
                        setSelectedTree({
                          depth: node.depth + 1,
                          name: "",
                          parentId: node.id,
                        })
                      );
                      dispatch(setType("add"));
                    }}
                  >
                    <Plus color="white" />
                  </Button>
                  {isLastChild && (
                    <Button
                      variant="ghost"
                      size="smallIcon"
                      className="hover:bg-red-600 bg-red-500 rounded-full"
                      onClick={() => {
                        deleteNode();
                      }}
                    >
                      <Trash className="w-2 h-2" color="white" />
                    </Button>
                  )}
      
                  <Button
                    variant="ghost"
                    size="smallIcon"
                    className="hover:bg-arctic-blue bg-arctic-blue rounded-full"
                    onClick={() => {
                      dispatch(
                        setSelectedTree({
                          depth: node.depth,
                          name: node.name,
                          parentId: node.parentId,
                          id: node.id,
                        })
                      );
                      dispatch(setType("edit"));
                    }}
                  >
                    <Edit color="white" />
                  </Button>
                </span>
              )}
            </div>
            {isExpanded && node.children && (
              <div className="ml-6 border-l pl-2">
                {node.children.map((child) => (
                  <TreeNode
                    key={child.name}
                    node={child}
                    expandedNodes={expandedNodes}
                    toggleNode={toggleNode}
                  />
                ))}
              </div>
            )}
          </>
        )
      }
    </div>
  );
};

const TreeView: React.FC<{ loading: boolean }> = ({ loading }) => {//+
  const selector = useSelector((state: RootState) => state.tree);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedRoot, setSelectedRoot] = useState<string | null>(null);

  // Get root folders (depth = 0)
  const rootFolders = selector.treeData?.length > 0 ? selector.treeData?.filter(item => item.depth === 0): [];

  // Filter tree data based on selected root
  const filteredTreeData = selectedRoot 
    ? selector.treeData.filter(item => 
        item.id === selectedRoot || 
        (item.parentId && item.parentId === selectedRoot)
      )
    : selector.treeData;
  const toggleNode = (name: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(name)) {
        newSet.delete(name);
      } else {
        newSet.add(name);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    if (!selector.treeData.length) return;
    const allNodeNames = new Set<string>();
    const collectNames = (nodes: IMenu[]) => {
      nodes.forEach((node) => {
        allNodeNames.add(node.name);
        if (node.children) collectNames(node.children);
      });
    };
    collectNames(selector.treeData);
    setExpandedNodes(allNodeNames);
  };

  const collapseAll = () => setExpandedNodes(new Set());

  useEffect(() => {
    if (expandedNodes.size === 0) {
      expandAll();
    }
  }, [selector.treeData]);

  return (
    <div className="rounded-lg w-96">
      {/* Expand/Collapse Buttons */}
      {/* Root Folder Selector */}
      <div className="mb-4 space-y-2">
        <label className="text-[#475467]">Menu</label>
        <select
          className="rounded-[16px] py-[14px] px-[16px] h-[52px] bg-[#F9FAFB] w-full"
          value={selectedRoot || ''}
          onChange={(e) => setSelectedRoot(e.target.value || null)}
        >
          <option value="">All Folders</option>
          {rootFolders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-2 flex space-x-2">
        <button
          onClick={expandAll}
          className="px-6 py-2 bg-blue-gray rounded-3xl text-white"
        >
          Expand All
        </button>
        <button
          onClick={collapseAll}
          className="px-6 py-2 bg-white border border-blue-gray rounded-3xl text-blue-gray"
        >
          Collapse All
        </button>
      </div>

      {loading ? (
        <div>
          ...Loading
        </div>
      ) : !selector.treeData.length || selector.treeData.length === 0 ? <div className="mt-6">
        No menu items found.
      </div> : filteredTreeData?.map((node) => (
        <TreeNode
          key={node.name}
          node={node}
          expandedNodes={expandedNodes}
          toggleNode={toggleNode}
        />
      ))}
    </div>
  );
};

export default TreeView;
