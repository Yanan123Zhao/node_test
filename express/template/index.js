function template (str, obj) {
  const head = "let tpl = ``;\nwith (obj) { tpl+=`"

  var str = str.replace(/<%=([\s\S]+?)%>/, function () {
    return "${" + arguments[1] + "}"
  })

  var str = str.replace(/<%([\s\S]+?)%>/g, function () {
    return "`;\n" + arguments[1] + "tpl+=`"
  })

  const tail = "`}return tpl"
 
  let fn = new Function('obj', head + str + tail)
  return fn(obj)
}

const str = `
  <%if (user) {%>
    hello <%=user.name%>
  <%} else {%>
    hello others
  <%}%> 
`

console.log(template(str, {user: {name: 'world'}}))