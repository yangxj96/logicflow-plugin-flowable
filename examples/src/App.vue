<script setup lang="ts">
import LogicFlow from "@logicflow/core";
import { Control, SelectionSelect } from "@logicflow/extension";
import "@logicflow/core/dist/index.css";
import "@logicflow/extension/dist/index.css";
import { onMounted, useTemplateRef } from "vue";
import Flowable from "@yangxj96/logicflow-flowable";

const container = useTemplateRef<HTMLDivElement>("container");
const graph = useTemplateRef<HTMLDivElement>("graph");
const property = useTemplateRef<HTMLDivElement>("property");

onMounted(() => {
    const lf = new LogicFlow({
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
        key: "export",
        title: "",
        text: "导出",
        iconClass: "export",
        onClick: lf => {
            const xml = Flowable.toBpmnXml(lf);
            console.log(xml);
        }
    });

    lf.render({});
});
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
