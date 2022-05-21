import { DesktopContext } from 'desktop/context'
import { action } from 'libs/action'
import { openFolder, selectFolder } from 'libs/io'
import { useContext } from 'react'

export function Generate () {
  const { source, config } = useContext(DesktopContext)

  return <div>
    Generate a website
    <button onClick={ async () => {
      const folder = await selectFolder()
      await action('folder/generate', {
        source: source.path,
        target: folder
      })
      openFolder(folder + config.sep + 'slashnotes')
    } }>Generate</button>
  </div>
}
