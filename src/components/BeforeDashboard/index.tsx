import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Welcome to Zillion Home CMS</h4>
      </Banner>
      <p>
        Use this dashboard to manage your website content, pages, and media.{' '}
        <a href="/" target="_blank">
          Visit your website
        </a>
        {' to see the results.'}
      </p>
    </div>
  )
}

export default BeforeDashboard
