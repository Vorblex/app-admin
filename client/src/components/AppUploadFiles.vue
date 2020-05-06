<template lang="pug">
  div
    v-file-input.mt-3(:value='files' @change='processFiles' accept=".jpeg, .jpg, .pdf, .tiff, .doc, .docx, .xls, .xlsx" color='blue' counter label='File input' multiple placeholder='Click and select your files' prepend-icon='mdi-paperclip' outlined :show-size='1000')
      template(#selection='{ index, text }')
        v-chip(v-if='index < 2' color='blue' dark label small)
          | {{ text }}
        span.overline.grey--text.text--darken-3.mx-2(v-else-if='index === 2')
          | +{{ files.length - 2 }} File(s)
    .drag-drop
      #file-drag-drop
        form(ref='fileform')
          span.drop-files Drop the files here!
            .drop-icon
              v-icon(color="#92b0b3" size='90') save_alt
        v-progress-linear.mt-4(v-model='uploadPercentage', height='14' rounded)
        .preview-wrap
          .file-listing(v-for='(file, key) in files' :key='key')
            img.preview(:ref="'preview'+parseInt( key )")
            | {{ file.name }}
            .remove-container(class='mt-auto')
              v-btn(@click='removeFile( key )' icon)
                v-icon(md color='red') delete
        v-btn.ma-2.white--text(@click='submitFiles()' :disabled='!files.length' color='blue-grey')
          | Upload
          v-icon(right='', dark='') mdi-cloud-upload

</template>
<script>
import axios from '~/services/api'
import { mapActions } from 'vuex'
  export default {
    props: ['id'],
    data(){
      return {
        dragAndDropCapable: false,
        files: [],
        uploadPercentage: 0
      }
    },

    mounted(){
      this.dragAndDropCapable = this.determineDragAndDropCapable()
      if( this.dragAndDropCapable ){
        ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach( evt => {
          this.$refs.fileform.addEventListener(evt, e => {
            e.preventDefault()
            e.stopPropagation()
          })
        })

        this.$refs.fileform.addEventListener('drop', e => this.processFiles(e.dataTransfer.files) )
        // this.$refs.fileinput.addEventListener('change', e => this.porcessFiles(e) )
      }
    },

    methods: {
      ...mapActions('base', {
        showMessage: 'showMessage'
      }),
      determineDragAndDropCapable(){
        var div = document.createElement('div')
        return ( ( 'draggable' in div )
                || ( 'ondragstart' in div && 'ondrop' in div ) )
                && 'FormData' in window
                && 'FileReader' in window
      },

      processFiles(files) {
        const length = files.length
        const tempFiles = []

        for( let i = 0; i < length; i++ ) {
          if ( /\.(jpe?g|pdf|tiff|doc|docx|xls|xlsx)$/i.test( files[i].name ) ) {
            tempFiles.push( files[i] )
            this.getImagePreviews(files[i], i)
          } else {
            this.showMessage({error: true, message: 'Wronge file format'})
          }
        }
        this.files = tempFiles
      },

      getImagePreviews(file, i){
          if ( /\.(jpe?g)$/i.test( file.name ) ) {
            const reader = new FileReader()
            reader.addEventListener('load', () => {
              this.$refs['preview'+parseInt( i )][0].src = reader.result
            }, false)
            reader.readAsDataURL( file )
          } else {
            this.$nextTick( () => {
              setTimeout(() => {
                this.$refs['preview'+parseInt( i )][0].src = '/images/filePlaceholder.png';
              },0)
            })
          }
      },
      resetData() {
        this.files = []
        this.uploadPercentage = 0
      },
      submitFiles(){
        const vm = this
        let formData = new FormData()
        for( var i = 0; i < vm.files.length; i++ ){
          let file = vm.files[i]
          console.log(file);
          formData.append('file', file)
        }
        formData.append('documentId', this.id)
        axios().put( '/files',
          formData,
          {
            headers: {
                // 'Content-Type': 'multipart/form-data',
              // 'enctype': 'multipart/form-data',
              'Process-Data': false,
              'Content-Type': false,
            },
            onUploadProgress: function( progressEvent ) {
              vm.uploadPercentage = parseInt( Math.round( ( progressEvent.loaded * 100 ) / progressEvent.total ) )
            }.bind(vm)
          }
        ).then(function(e){
          if(e.status > 299 ) throw new Error(e.message)
          vm.resetData()
          vm.showMessage({})
          vm.$emit('upload')
        })
        .catch(function({ message }){
          vm.resetData()
          vm.showMessage({ message, error: true })
        })
      },
      removeFile( key ){
        this.files.splice( key, 1 )
      }
    }
  }
</script>

<style lang='scss' scoped>
  .drag-drop {
    max-width: 300px;
    margin: 0 auto;
    text-align: center;
  }

  .preview-wrap {
    display: flex;
    flex-wrap: wrap;
  }

  span.drop-files {
    display: inline-block;
    color: #0f3c4b;
  }

  form{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    width: 300px;
    background-color: #c8dadf;
    margin: auto;
    margin-top: 40px;
    text-align: center;
    // line-height: 400px;
    border-radius: 4px;
    outline: 2px dashed #92b0b3;
    outline-offset: -10px;
  }
  div.file-listing{
    width: 20%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    padding: 5px;
  }
  div.file-listing img{
    max-width: 100%;
    height: auto;
  }
  div.remove-container{
    text-align: center;
  }
  div.remove-container a{
    color: red;
    cursor: pointer;
  }
  a.submit-button{
    display: block;
    margin: auto;
    text-align: center;
    width: 200px;
    padding: 10px;
    text-transform: uppercase;
    background-color: #CCC;
    color: white;
    font-weight: bold;
    margin-top: 20px;
  }
  progress {
    width: 300px;
    margin: auto;
    display: block;
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>