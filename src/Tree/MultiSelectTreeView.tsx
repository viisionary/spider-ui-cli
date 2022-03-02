import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import concat from "lodash/concat";
import remove from "lodash/remove";
import {TreeItem, TreeView} from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export interface RenderTree {
    nodeId: string;
    label: string;
    children?: readonly RenderTree[];
    disabled?: boolean;
    checked: any;
    indeterminate: boolean
}

const getDeepestChildren = (nodes) => {
    if (nodes.children) {
        return nodes.children.map((item) =>
            item.children ? getDeepestChildren(item.children) : item.nodeId
        );
    } else {
        return nodes.map((item) => item.nodeId);
    }
};
const renderTree = (nodes: RenderTree, selected, onChange, disabled) => {
    const handleChange = (e, value) => {
        if (nodes.children) {
            // TODO：优化
            // TODO：去除 disable 后的 item
            const childrenIds = getDeepestChildren(nodes).flat();
            if (!value) {
                const newSelected = remove(selected, (n) => !childrenIds.includes(n));
                onChange(newSelected);
            } else {
                //? 去重
                const newSelected = [...concat(selected, childrenIds)];
                onChange(newSelected);
            }
            return;
        }
        if (!value) {
            const newSelected = remove(selected, (n) => n !== nodes.nodeId);
            onChange(newSelected);
        } else {
            const newSelected = concat(selected, nodes.nodeId);
            onChange(newSelected);
        }
    };

    return (
        <TreeItem
            key={nodes.nodeId}
            nodeId={nodes.nodeId}
            label={
                <>
                    <FormControlLabel
                        label={nodes.label}
                        disabled={nodes.disabled}
                        control={
                            <Checkbox
                                checked={nodes.disabled || Boolean(nodes.checked)}
                                indeterminate={nodes.indeterminate}
                                onChange={handleChange}
                            />
                        }
                    />
                </>
            }
        >
            {Array.isArray(nodes.children)
                ? nodes.children.map((node) => renderTree(node, selected, onChange, disabled))
                : null}
        </TreeItem>
    );
};
export const check = (elements, selected, disabled) => {
    //TODO  = = 禁用相关
    if (Array.isArray(elements.children)) {
        elements.children.forEach((item) => check(item, selected, disabled));
        const checkedAll = elements.children.every((item) => item.checked);
        const checkedAllDisable = elements.children.every((item) => item.disabled);
        const checkedSome = elements.children.some((item) => item.checked || item.indeterminate);
        elements.checked = checkedAll;
        elements.disabled = checkedAllDisable;
        elements.indeterminate = checkedAll ? false : checkedSome;
    } else {
        if (selected.includes(elements.nodeId)) {
            elements.checked = true;
        } else {
            elements.checked = false;
        }
        elements.disabled = !!disabled.includes(elements.nodeId);
    }
};

interface Props {
    disabled?: string[];
    selected: string[];
    elements: any[];
    onChange: () => void;
}

export default function MultiSelectTreeView<Props>({selected = [], elements = [], onChange, disabled = []}) {
    if (!elements) {
        return null;
    }
    elements.forEach((item) => check(item, selected, disabled));
    return (
        <TreeView
            disableSelection
            disabledItemsFocusable
            defaultCollapseIcon={<ExpandMoreIcon/>}
            defaultExpandIcon={<ChevronRightIcon/>}
        >
            {elements.map((item) => renderTree(item, selected, onChange, disabled))}
        </TreeView>
    );
}
