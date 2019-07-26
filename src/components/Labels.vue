<template>
  <div class="labels border">
    <h3 class="labels-title">
      Labels
      <span
        class="label"
        v-if="selectedLabel"
        :style="`background: #${selectedLabel.color};`"
        @click="selectLabel(false)"
      >{{selectedLabel.name}} ({{labels[selectedLabel.name].length}})</span>
    </h3>
    <div class="labels-list">
      <span
        class="label"
        v-for="label in Object.keys(labels)"
        v-show="!selectedLabel || selectedLabel.name !== label"
        :key="label"
        :style="`
          background: #${labels[label][0].color};
        `"
        @click="selectLabel(labels[label][0])"
      >{{labels[label][0].name}} ({{labels[label].length}})</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['labels'],
  data () {
    return {
      selectedLabel: null
    }
  },
  watch: {
    selectedLabel (val) {
      this.$emit('selectLabel', val ? val.name : '')
    }
  },
  methods: {
    selectLabel (label) {
      if (label) {
        this.selectedLabel = label
      } else {
        this.selectedLabel = null
      }
    },
    reset () {
      this.selectedLabel = null
    }
  }
}
</script>

<style lang="less" scoped>
@import '../assets/style/variables.less';

.labels {
  background: #fff;
  margin-bottom: @gapOuter;
  &-title {
    display: flex;
    justify-content: space-between;
    margin: 0;
    padding: @gapOuter;
    padding-right: 0;
    height: 50px;
    box-sizing: border-box;
    font-weight: normal;
    border-bottom: 1px solid @firstBorderColor;
    color: @regularFontColor;
    .label {
      margin-bottom: 0;
    }
  }
  &-list {
    padding: @gapOuter;
    padding-bottom: @gapInner;
    padding-right: 0;
  }
}

.label {
  display: inline-block;
  margin-right: @gapInner;
  margin-bottom: @gapInner;
  padding: 2px @gapInner;
  color: #fff;
  border-radius: 3px;
  cursor: pointer;
  user-select: none;
  font-size: 1rem;
  &.selected {
    border: 2px dashed @secondBorderColor;
  }
}
</style>
