import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'eduor',

  projectId: '1a142z34',
  dataset: 'production',
  basePath: "/studio",
  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
