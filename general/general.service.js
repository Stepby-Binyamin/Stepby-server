const templatService = require('../template/template.service')
const userService = require('../user/user.service')


const makeItAll = async ({ }) => {
    const biz = userService.register({ phoneNumber: "0525381648", firstName: "betsalel", lastName:"mizrachy", email:"betsalel@gmail.com", bizName:"freeShuly", categories: "hodu" })
    userService.newClient({ fullName: "shuly", phoneNumber: "0532548654", email: "freeShuly@gmail.com" },{_id :biz._id })
    templatService.createTemplate({userId: biz._id, templateName:" "})
    userService.
    templatService.createProject
    templatService.createStep
    templatService.dataToStep
}

module.exports = makeItAll;