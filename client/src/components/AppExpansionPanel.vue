<template lang='pug'>
  v-expansion-panels
    v-expansion-panel
      v-expansion-panel-header(disable-icon-rotate)
        v-row(no-gutters)
          v-col(cols='12')
            span(class='mr-2') Images
            span(class='text-secondary') {{ getImgs.length }}
        template(#actions)
          v-icon(color='blue') mdi-image
      v-expansion-panel-content
        v-list
          v-list-item(v-for='file in getImgs', :key='file.id', @click='')
            //- v-hover(#default="{ hover }")
            div(class="preview-wrap")
              v-img(:src='`/uploads${file.path}`' height='40')
                //- div(v-if="hover" class="d-flex preview")
                    v-img(:src='`/file?id=${file.id}`')
            v-list-item-content
              v-list-item-title(class='pl-2') {{file.name}}
            v-list-item-action
              v-tooltip(top)
                template(#activator='{on}')
                  div(v-on='on')
                    v-btn(:href='`/uploads${file.path}`' icon download)
                      v-icon(color="primary") save_alt
                span Download
            v-list-item-action
              v-btn(@click='$emit(`delete`, file)' icon)
                v-icon(md color='red') delete

    v-expansion-panel
      v-expansion-panel-header(disable-icon-rotate)
        v-row(no-gutters)
          v-col(cols='12')
            span(class='mr-2') Files
            span(class='text-secondary') {{ getDocs.length }}
        template(#actions)
          v-icon(color='blue') mdi-file
      v-expansion-panel-content
        v-list
          v-list-item(v-for='file in getDocs', :key='file.id', @click='')
            v-list-item-avatar
              v-icon(color="warning") mdi-file
            v-list-item-content
              v-list-item-title {{file.name}}
            v-list-item-action
              v-tooltip(top)
                template(#activator='{on}')
                  div(v-on='on')
                    v-btn(:href='`/uploads${file.path}`' icon download)
                      v-icon(color="primary") save_alt
                span Download
            v-list-item-action
              v-btn(@click='$emit(`delete`, file)' icon)
                v-icon(md color='red') delete
</template>

<script>

export default {
  props: ['data'],
  data: () => ({}),
  computed: {
    getImgs() {
      if(!this.data) return
      return this.data.files.filter(f => f.type === 'image')
    },
    getDocs() {
      if(!this.data) return
      return this.data.files.filter(f => f.type === 'text')
    }
  }
}
</script>

<style lang='scss' scoped>

  .v-expansion-panel-content {
      max-height: 460px;
      overflow-y: auto;
  }

  .preview {
      overflow: hidden;
      position: fixed;
      z-index: 100;
      width: 250px;
      animation: scale .3s;
      border-radius: 3px;

      &-wrap {
        width: 70px;
        overflow: hidden;
        position: relative;
        border-radius: 3px;
        cursor: pointer;
      }
  }

  @keyframes scale {
    from {
      transform: scale(.1);
    }

    to {
      transform: scale(1);
    }
  }

</style>
