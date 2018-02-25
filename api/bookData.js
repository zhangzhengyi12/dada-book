class Book {
  constructor({ name, icon, lastChapterName, author, category, desc, source, uptime }) {
    this.name = name
    this.icon = icon
    this.lastChapterName = lastChapterName
    this.author = author
    this.category = category
    this.desc = desc
    this.source = source
    this.uptime = uptime
  }
}

export { Book }
