import {useRef, useState, useEffect, useLayoutEffect} from "react";
import {useNavigate} from "react-router";
import axios from "../api/axios";
import {
	faInfoCircle,
	faCircleCheck,
	faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export const Signin = () => {
	const navigate = useNavigate();
	const userRef = useRef();
	const errRef = useRef();
	const passRef = useRef();

	const [user, setUser] = useState("");
	const [validName, setValidName] = useState(false);
	const [userFocus, setUserFocus] = useState(false);

	const [pwd, setPwd] = useState("");
	const [validPwd, setValidPwd] = useState(false);
	const [pwdFocus, setPwdFocus] = useState(false);

	const [errMsg, setErrMsg] = useState("");
    
	//state for block showing info about spinner and errMsg
	const [showInfo, setShowInfo] = useState(false);
	//state for spinner
	const [spinner, setSpinner] = useState(false);

	// Focus to Username field on load
	useEffect(() => {
		userRef.current.focus();
	}, []);
    
	useLayoutEffect(() => {
		const result = user.length > 2 ? true :false;
		setValidName(result)
	},[user])

	useLayoutEffect(() => {
		const bool = pwd.length > 3 ? true :false;
		setValidPwd(bool)
	},[pwd])

	

	
	//Hide errMsg and Spinner (when user changes any input)
	useLayoutEffect(() => {
		setShowInfo(false);
		setSpinner(false);
		
	}, [userFocus, pwdFocus]);

	//Hide and show spinner (based on errMsg and showInfo state)
	useLayoutEffect(() => {
		setSpinner(!errMsg);
	}, [errMsg, showInfo]);

	//handle form submit
	const handleSubmit = async (e) => {
		e.preventDefault();
		//hide errMsg and show spinner
		setErrMsg("");
		setShowInfo(true);
		
		// Check validity of current input
		if(!validName || !validPwd) {
			return;
		}
		//Send Authentication Request
		try {
			const response = await axios.post(
				"/auth",
				JSON.stringify({user, pwd}),
				{
					headers: {"Content-Type": "application/json"},
					withCredentials: true,
				})
			console.log(response)
			if(response.status === 200) {
				sessionStorage.setItem("authUser", response.data)
				navigate("/home");
			}else{
				console.log(response)
				throw new Error(response);
			}
		} catch(error) {
			console.log("error",error.message)
			if (!error?.response) {
				console.log("if")
				setErrMsg("No server Response");
			} 
			else if (error.response.status) {
				console.log("else if")
				console.log(error.response)
				switch (error.response.status) {
					case 400:
						setErrMsg("Username and Password is required");
						break;
					case 401:
						setErrMsg("Username or Password is invalid");
						break;
					default:
						setErrMsg(`Signin Failed: ${error.message}`);
						break;
				}
			} 
			else {
				console.log("else")
				console.log(error)
				setErrMsg(error.message);
			}


		}   
		//Reset fields
		    setPwd("")
			setUser("")
			//for screen readers
			errRef.current.click();
			errRef.current.focus();
	};

	return (
		<section className="form-section">
			<h1 className="heading">Sign In</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<label
						
						className="label"
						htmlFor="username"
					>
						Username:&nbsp;
						<span className={`${!validName && user.length !== 0  ? "invalid" : "hide"} label-icon`}>
							<FontAwesomeIcon icon={faCircleXmark} />
						</span>
					</label>
					<input
						type="text"
						id="username"
						ref={userRef}
						value={user}
						autoComplete="off"
						onChange={(e) => setUser(e.target.value)}
						required
						aria-invalid={validName ? "false" : "true"}
						aria-describedby="uidnote"
						onFocus={() => setUserFocus(true)}
						onBlur={() => setUserFocus(false)}
					/>
					<p id="uidnote" className="offscreen">
						Enter your registered username.
					</p>
				</div>

				<div>
					<label  htmlFor="password">
						Password:&nbsp;
						<span className={`${!validPwd && pwd.length !== 0 ? "invalid" : "hide"} label-icon`}>
							<FontAwesomeIcon icon={faCircleXmark} />
						</span>
					</label>
					<input
						type="password"
						id="password"
						ref={passRef}
						value={pwd}
						onChange={(e) => setPwd(e.target.value)}
						required
						aria-invalid={validName ? "false" : "true"}
						aria-describedby="pwdnote"
						onFocus={() => setPwdFocus(true)}
						onBlur={() => setPwdFocus(false)}
					/>
					<p id="pwdnote" className="offscreen">
						Enter registered password for username.
					</p>
				</div>

				<div className="actions">
					<button
						type="submit"
						className="submit action"
						disabled={validName && validPwd ? false : true}
					>
						Sign In
					</button>
					<div className={showInfo ? "info show-info" : "info hidden"}>
						<span className={spinner ? "spin" : "hidden"}>
							<div className="spinner-3"></div>
						</span>
						<p ref={errRef} className={errMsg ? "errMsg" : "registering"}>
							{!errMsg ? "Signing In..." : errMsg}
						</p>
					</div>
				</div>

				<div className="additional-actions">
					<div>
						<Link>Forgot Password</Link>
					
					</div>
					<div>
						<p className="button-prompt">Need an account?</p>
						<button className="action" onClick={()=>{navigate('/register')}} type="button">Sign Up</button>	</div>
				</div>
			</form>
		</section>
	);
};
