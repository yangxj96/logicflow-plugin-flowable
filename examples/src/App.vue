<script setup lang="ts">
import LogicFlow from "@logicflow/core";
import { Control, SelectionSelect } from "@logicflow/extension";
import "@logicflow/core/dist/index.css";
import "@logicflow/extension/dist/index.css";
import { onMounted, useTemplateRef } from "vue";
import Flowable from "@yangxj96/logicflow-plugin-flowable";
import { ElMessage, ElMessageBox } from "element-plus";

const container = useTemplateRef<HTMLDivElement>("container");
const graph = useTemplateRef<HTMLDivElement>("graph");
const property = useTemplateRef<HTMLDivElement>("property");

let lf: LogicFlow;

onMounted(() => {
    lf = new LogicFlow({
        container: container.value!,
        grid: true,
        history: true,
        plugins: [Control, SelectionSelect, Flowable.Plugin],
        pluginsOptions: {
            selectionSelect: {
                exclusiveMode: false
            },
            flowable: {
                panel: {
                    dnd: graph.value,
                    property: property.value
                },
                pickers: ["form", "user"]
            }
        }
    });

    (lf.extension.control as Control)?.addItem({
        key: "import",
        title: "",
        text: "导入",
        iconClass: "lf-control-import",
        onClick: () => {
            handleImport();
        }
    });

    (lf.extension.control as Control)?.addItem({
        key: "export",
        title: "",
        text: "导出",
        iconClass: "lf-control-export",
        onClick: () => {
            const xml = Flowable.toBpmnXml(lf);
            console.log(xml);
            ElMessage.success("已导出到控制台");
        }
    });

    lf.render({});

    lf.on("property:picker", (payload: any) => {
        console.log("[examples] property:picker:", payload);
        const value = window.prompt(`选择 ${payload.pickerType}（field: ${payload.field}）`);
        if (value) payload.resolve(value);
    });
});

function handleImport() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xml,.bpmn,.bpmn20.xml";
    input.onchange = async (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        try {
            const xmlString = await file.text();
            const result = Flowable.fromBpmnXml(xmlString, lf);

            if (result.success) {
                ElMessage.success(result.message || "导入成功");
            } else {
                ElMessageBox.alert(result.message || "导入失败", "导入错误", {
                    confirmButtonText: "确定",
                    type: "error"
                });
            }
        } catch (err: any) {
            ElMessageBox.alert(`读取文件失败: ${err.message}`, "文件错误", {
                confirmButtonText: "确定",
                type: "error"
            });
        }
    };
    input.click();
}
</script>

<template>
    <el-row class="box">
        <el-col :span="4" style="height: 100%">
            <div ref="graph" style="height: 100%" />
        </el-col>
        <el-col :span="15" style="height: 100%">
            <div ref="container" style="height: 100%" />
        </el-col>
        <el-col :span="5" style="height: 100%">
            <div ref="property" style="height: 100%" />
        </el-col>
    </el-row>
</template>

<style>
body {
    padding: 0;
    margin: 0;
}

.box {
    width: 100vw;
    height: 99vh;
}

/* 导入图标 */
.lf-control-import {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNDc0NzQ3IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIyIDE5YTIgMiAwIDAgMS0yIDJINGEyIDIgMCAwIDEtMi0yVjVhMiAyIDAgMCAxIDItMmg1bDIgM2g5YTIgMiAwIDAgMSAyIDJ6Ij48L3BhdGg+PGxpbmUgeDE9IjEyIiB5MT0iMTEiIHgyPSIxMiIgeTI9IjE3Ij48L2xpbmU+PHBvbHlsaW5lIHBvaW50cz0iOSAxNCAxMiAxMSAxNSAxNCI+PC9wb2x5bGluZT48L3N2Zz4=");
}

/* 导出图标 */
.lf-control-export {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNDc0NzQ3IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIxIDE1djRhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJ2LTQiPjwvcGF0aD48cG9seWxpbmUgcG9pbnRzPSI3IDEwIDEyIDE1IDE3IDEwIj48L3BvbHlsaW5lPjxsaW5lIHgxPSIxMiIgeTE9IjE1IiB4Mj0iMTIiIHkyPSIzIj48L2xpbmU+PC9zdmc+");
}
</style>
