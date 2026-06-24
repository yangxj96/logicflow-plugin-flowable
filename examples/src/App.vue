<script setup lang="ts">
import LogicFlow from "@logicflow/core";
import { Control, SelectionSelect } from "@logicflow/extension";
import "@logicflow/core/dist/index.css";
import "@logicflow/extension/dist/index.css";
import { onMounted, useTemplateRef } from "vue";
import Flowable from "@yangxj96/logicflow-flowable";
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
                }
            }
        }
    });

    (lf.extension.control as Control)?.addItem({
        key: "import",
        title: "",
        text: "导入",
        iconClass: "import",
        onClick: () => {
            handleImport();
        }
    });

    (lf.extension.control as Control)?.addItem({
        key: "export",
        title: "",
        text: "导出",
        iconClass: "export",
        onClick: () => {
            const xml = Flowable.toBpmnXml(lf);
            console.log(xml);
            ElMessage.success("已导出到控制台");
        }
    });

    lf.render({});
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
</style>
