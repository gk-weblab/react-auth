
export const Success = ({msg}) => {  
  return (
    <section className="success">
        <h1 aria-live="assertive">{msg}</h1>
        <h3 aria-live="assertive">Thanks for registering, You can now Sing in to your account.</h3>
        <button className="singin action">Sing In</button>
    </section>
  )
}

