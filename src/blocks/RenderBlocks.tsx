import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import {
  CapabilityListBlock,
  CategoryBarBlock,
  CtaBandBlock,
  PageIntroBlock,
  ProcessSectionBlock,
  ProseSectionBlock,
  ServiceCardsBlock,
  ServiceDetailsBlock,
  SplitFeatureBlock,
} from '@/blocks/marketing/components'
import { MARKETING_BLOCK_TYPES } from '@/utilities/pageContent'

const blockComponents: Record<string, React.ComponentType<any>> = {
  capabilityList: CapabilityListBlock,
  categoryBar: CategoryBarBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  ctaBand: CtaBandBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  pageIntro: PageIntroBlock,
  processSection: ProcessSectionBlock,
  proseSection: ProseSectionBlock,
  serviceCards: ServiceCardsBlock,
  serviceDetails: ServiceDetailsBlock,
  splitFeature: SplitFeatureBlock,
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
            if (MARKETING_BLOCK_TYPES.has(blockType)) {
              return <Block {...block} key={block.id || index} />
            }

            return (
              <div className="my-16" key={block.id || index}>
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
