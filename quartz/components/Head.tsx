import React from "react"
import { i18n } from "../i18n"
import { FullSlug, joinSegments, pathToRoot } from "../util/path"
import { CSSResourceToStyleElement, JSResourceToScriptElement } from "../util/resources"
import { googleFontHref, googleFontSubsetHref } from "../util/theme"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { unescapeHTML } from "../util/escape"

export default (() => {
  const Head: QuartzComponent = ({ cfg, fileData, externalResources }: QuartzComponentProps) => {
    const titleSuffix = cfg.pageTitleSuffix ?? ""
    const title = (fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title) + titleSuffix
    const description = fileData.frontmatter?.description ?? fileData.description?.trim() ?? i18n(cfg.locale).propertyDefaults.description
    const { css, js, additionalHead } = externalResources
    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    const baseDir = fileData.slug === "404" ? "/" : pathToRoot(fileData.slug!)
    const iconPath = joinSegments(baseDir, "static/icon.png")

    return (
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <link rel="icon" href={iconPath} />
        {css.map((resource) => CSSResourceToStyleElement(resource, true))}
        {js.filter((resource) => resource.loadTime === "beforeDOMReady").map((res) => JSResourceToScriptElement(res, true))}
      </head>
    )
  }
  return Head
}) satisfies QuartzComponentConstructor