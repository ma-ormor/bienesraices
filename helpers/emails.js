import nodemailer from 'nodemailer'

const emailRegistro = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });//function

  const {email, nombre, token} = datos

  await transport.sendMail({
    from: 'BienesRaíces.com',
    to: email,
    subject: 'Cambia tu contraseña en BienesRaices.com',
    text: 'Cambia tu contraseña en BienesRaices.com',
    html: `
      <p>Hola ${nombre}, comprueba tú cuenta en BR.com</p>

      <p>
        Confirmala en el siguiente enlace:
        <a href="${process.env.EMAIL_URL}:${process.env.PORT??3000}/auth/confirmar/${token}">
          Confirmar Cuenta
        </a>
      </p>

      <p>Ignora el correo, si no creaste la cuenta</p>
    `
  });
}//function

const emailOlvidePassword = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });//function

  const {email, nombre, token} = datos

  await transport.sendMail({
    from: 'BienesRaíces.com',
    to: email,
    subject: 'Cambia tu contraseña en BienesRaices.com',
    text: 'Cambia tu contraseña en BienesRaices.com',
    html: `
      <p>Hola ${nombre}, pediste cambiar recuperar tu cuenta en BR.com</p>

      <p>
        Sigue el siguiente enlace:
        <a href="${process.env.EMAIL_URL}:${process.env.PORT??3000}/auth/recuperar-contrasena/${token}">
          Cambiar contraseña
        </a>
      </p>

      <p>Ignora el correo, si no pediste el cambio</p>
    `
  });
}//function

export {
  emailRegistro,
  emailOlvidePassword
}