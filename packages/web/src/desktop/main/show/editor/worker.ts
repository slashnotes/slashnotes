import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
self.MonacoEnvironment = {
  getWorker (_: any, label: string) {
    return new editorWorker()
  }
}

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true)
