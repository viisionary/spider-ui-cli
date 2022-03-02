import React from "react";
import { TreeItem, TreeView } from "@mui/lab";
import { RenderTree } from "./MultiSelectTreeView";

/**
 Created by IntelliJ IDEA.
 User: visionary
 Date: 2021/10/21
 Time: 5:04 PM

 描述：
 **/

interface Props {
  disabled?: string[];
  selected: string[];
  elements: any[];
  onChange: (ids: string[]) => void;
}

const renderTree = (nodes: RenderTree, selected: string[], onChange: any, disabled?: string[]) => {
  const handleChange = (id: string) => {
    if (nodes.children) {
      return;
    }
    //TODO 去重
    const newSelected = [id];
    onChange(newSelected);
  };
  return (
    <TreeItem
      sx={{ paddingY: 2 }}
      key={nodes.nodeId}
      disabled={disabled?.includes(nodes.nodeId)}
      nodeId={nodes.nodeId}
      label={nodes.label}
      onClick={() => handleChange(nodes.nodeId)}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node, selected, onChange, disabled))
        : null}
    </TreeItem>
  );
};
const CustomTreeView: React.FC<Props> = ({ selected, elements, onChange, disabled }) => {
  if (!elements) {
    return null;
  }
  return (
    <TreeView
      disableSelection
      disabledItemsFocusable
    >
      {elements.map((item) => renderTree(item, selected, onChange, disabled))}
    </TreeView>
  );
};
export default CustomTreeView;
