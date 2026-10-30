export type ProjectPhotoCopy = {
  title: string
  intro: string
  createHint: string
  editHint: string
  choose: string
  chooseBusy: string
  drop: string
  featured: string
  setFeatured: string
  remove: string
  onlyImages: string
  tooMany: (max: number) => string
  progress: (current: number, total: number, filename: string) => string
  chooseOne: string
  added: (count: number, names: string) => string
  reloadListHint: string
  unsaved: string
  reloadDiscard: string
  reloadList: string
  couldNot: string
  legacyFeatured: string
  noneYet: string
  savingPhotos: string
  loading: string
  loadFailed: string
}

const en: ProjectPhotoCopy = {
  title: 'Project photos',
  intro:
    'Add the gallery and the featured image in one step. Choose or drop several images, then mark one as the featured image. The English title comes from the file name. Show on the website and Allow download both start on.',
  createHint:
    'The featured image is saved on the project and placed first in the gallery. Photos upload when you save.',
  editHint:
    'New photos are added immediately. Mark one as the featured image, then save the project. Gallery order stays as it is.',
  choose: 'Choose photos',
  chooseBusy: 'Uploading…',
  drop: 'Or drop images here.',
  featured: 'Featured image',
  setFeatured: 'Set as featured image',
  remove: 'Remove',
  onlyImages: 'Only image files can be added to the gallery.',
  tooMany: (max) => `Choose up to ${max} photos at a time.`,
  progress: (current, total, filename) => `Uploading ${current} of ${total}: ${filename}`,
  chooseOne: 'Choose at least one image.',
  added: (count, names) => `Added ${count} ${count === 1 ? 'photo' : 'photos'}: ${names}.`,
  reloadListHint: ' Reload the page to show them in the gallery list.',
  unsaved:
    'This project has unsaved edits. Photos still upload. Reload only after you save, or those edits are discarded.',
  reloadDiscard: 'Reload and discard unsaved edits',
  reloadList: 'Reload gallery list',
  couldNot: 'Could not upload these photos. Try again.',
  legacyFeatured:
    'This featured image is not in the gallery. Choose a gallery photo to replace it.',
  noneYet: 'No photos yet.',
  savingPhotos: 'Uploading photos, then saving the project…',
  loading: 'Loading photos…',
  loadFailed: 'Could not load the gallery.',
}

const zh: ProjectPhotoCopy = {
  title: '项目照片',
  intro:
    '在同一步添加图库并指定封面。可一次选择或拖入多张图片，并将其中一张标为封面。英文标题取自文件名。照片默认在网站上显示，并允许下载。',
  createHint: '标为封面的照片会写入封面图，并排在图库最前。这些照片会在保存项目时一并上传。',
  editHint: '新照片会立即加入图库。更换封面后，保存项目才会生效。图库顺序保持不变。',
  choose: '选择照片',
  chooseBusy: '正在上传…',
  drop: '或将图片拖到这里。',
  featured: '封面',
  setFeatured: '设为封面',
  remove: '移除',
  onlyImages: '只能把图片加入图库。',
  tooMany: (max) => `一次最多选择 ${max} 张照片。`,
  progress: (current, total, filename) => `正在上传第 ${current} 张，共 ${total} 张：${filename}`,
  chooseOne: '请至少选择一张图片。',
  added: (count, names) => `已添加 ${count} 张照片：${names}。`,
  reloadListHint: ' 刷新页面后会显示在图库列表中。',
  unsaved: '这个项目有未保存的修改。照片仍会上传。请先保存再刷新，否则这些修改会被丢弃。',
  reloadDiscard: '刷新并丢弃未保存的修改',
  reloadList: '刷新图库列表',
  couldNot: '这些照片没能上传。请再试一次。',
  legacyFeatured: '这张封面不在图库里。从图库里另选一张封面即可替换它。',
  noneYet: '还没有照片。',
  savingPhotos: '正在上传照片，随后会保存项目…',
  loading: '正在读取照片…',
  loadFailed: '无法读取图库。',
}

export function projectPhotoCopy(locale: string): ProjectPhotoCopy {
  return locale === 'zh' ? zh : en
}
