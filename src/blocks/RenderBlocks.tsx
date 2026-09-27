import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'

type BlockType = Page['layout'][0]['blockType']

const blockComponents: Record<BlockType, React.ComponentType<any>> = {
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block
          const Block = blockComponents[blockType]

          if (Block) {
            return (
              <div className="my-16" key={index}>
                <Block {...block} disableInnerContainer />
              </div>
            )
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
