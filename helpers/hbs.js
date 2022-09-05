const Handlebars = require("handlebars")

module.exports = {
  dateF: function (createdAt) {
    const dateC = new Date(createdAt)
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }
    return new Intl.DateTimeFormat("en-US", options).format(dateC).trim()
  },
  linkF: function (solution) {
    var url = Handlebars.escapeExpression(url),
      text = Handlebars.escapeExpression(text)

    return new Handlebars.SafeString("<a href='" + url + "'>" + text + "</a>")
  }
}
