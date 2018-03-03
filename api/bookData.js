class Book {
  constructor({ name, icon, lastChapterName, author, category, desc, source, uptime, url }) {
    this.name = name
    this.icon = icon
    this.lastChapterName = lastChapterName
    this.author = author
    this.category = category
    this.desc = desc
    this.source = source
    this.sourceId = source.id
    this.uptime = uptime
    // 主要给阅读器的部分
    this.url = url
    this.currentChapter = 0
    this.chapters = []
  }
}

export { Book }
