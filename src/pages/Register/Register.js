import {useRef, useState, useEffect, useLayoutEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import {
	faInfoCircle,
	faCircleCheck,
	faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import {Success} from "./Success";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export const Register = () => {
	const navigate = useNavigate()
	const userRef = useRef();
	const errRef = useRef();
	const passRef = useRef();
	const matchRef = useRef();

	const [user, setUser] = useState("");
	const [validName, setValidName] = useState(false);
	const [userFocus, setUserFocus] = useState(false);

	const [pwd, setPwd] = useState("");
	const [validPwd, setValidPwd] = useState(false);
	const [pwdFocus, setPwdFocus] = useState(false);

	const [matchPwd, setPwdMatch] = useState("");
	const [validMatch, setValidMatch] = useState(false);
	const [matchFocus, setMatchFocus] = useState(false);

	const [errMsg, setErrMsg] = useState("How to");
	const [success, setSuccess] = useState({value: false, message: ""});
	//state for block showing info about spinner and errMsg
	const [showInfo, setShowInfo] = useState(false);
	//state for spinner
	const [spinner, setSpinner] = useState(false);

	// Focus to Username field on load
	useEffect(() => {
		userRef.current.focus();
	}, []);

	//check valid when user changes
	useLayoutEffect(() => {
		const result = USER_REGEX.test(user);
		console.log(result);
		setValidName(result);
	}, [user]);

	//check pwd valid when pwd changes both
	useLayoutEffect(() => {
		const result = PWD_REGEX.test(pwd);
		setValidPwd(result);
		const match = pwd === matchPwd;
		setValidMatch(match);
		console.table(result, match, pwd);
	}, [pwd, matchPwd]);

	//Hide errMsg and Spinner (when user changes any input)
	useLayoutEffect(() => {
		setErrMsg("");
		setShowInfo(false);
		setSpinner(false);
	}, [user, pwd, matchPwd]);

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

		//test validity
		const v1 = USER_REGEX.test(user);
		const v2 = PWD_REGEX.test(pwd);
		if (!v1 || !v2) {
			setErrMsg("Invalid Entry");
			return;
		}
		//try request
		try {
			const response = await axios.post(
				"/register",
				JSON.stringify({user, pwd}),
				{
					headers: {"Content-Type": "application/json"},
					withCredentials: true,
				}
			);
			console.log(response);
			if (response.status === 201) {
				setSuccess({value: true, message: response.data.message});
			} else {
				throw new Error(response);
			}
		} catch (error) {
			console.log(error);
			if (!error?.response) {
				setErrMsg("No server Response");
			} else if (error.response) {
				switch (error.response.status) {
					case 409:
						setErrMsg("Username Already Exists");
						break;
					case 500:
						setErrMsg("Registration Failed Server Error");
						break;
					default:
						setErrMsg(`Registration Failed: ${error.message}`);
				}
			} else {
				setErrMsg(error.message);
			}
			
		}
		//for screen readers
		errRef.current.click();
		errRef.current.focus();
	};

	return (
		<section className="form-section">
			{success.value ? (
				<Success msg={success.message} />
			) : (
				<>
					<h1 className="heading">Register</h1>
					<form onSubmit={handleSubmit}>
						<div>
							<label
								onBlur={() => setUserFocus(false)}
								className="label"
								htmlFor="username"
							>
								Username:&nbsp;
								<span className={`${validName ? "valid" : "hide"} label-icon`}>
									<FontAwesomeIcon icon={faCircleCheck} />
								</span>
								<span
									onClick={() => {
										setUser("");
									}}
									className={`${
										validName || !user ? "hide" : "invalid"
									} label-icon`}
								>
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
							/>
							<p
								id="uidnote"
								className={
									userFocus && user && !validName ? "instruction" : "offscreen"
								}
							>
								<span className="notes">
									<FontAwesomeIcon icon={faInfoCircle} />
									&nbsp; 4 to 24 charcters, <br />
									Must begin with a letter.
									<br />
									Letters,numbers,underscores,hyphens allowed.
								</span>
							</p>
						</div>

						<div>
							<label onBlur={() => setPwdFocus(false)} htmlFor="password">
								Password:&nbsp;
								<span className={`${validPwd ? "valid" : "hide"} label-icon`}>
									<FontAwesomeIcon icon={faCircleCheck} />
								</span>
								<span
									onClick={() => {
										setPwd("");
									}}
									className={`${
										validPwd || !pwd ? "hide" : "invalid"
									} label-icon`}
								>
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
							/>
							<p
								id="pwdnote"
								className={
									pwdFocus && pwd && !validPwd ? "instruction" : "offscreen"
								}
							>
								<span className="notes">
									<FontAwesomeIcon icon={faInfoCircle} />
									&nbsp; 4 to 24 charcters, <br />
									Must begin with a letter.
									<br />
									Letters,numbers,underscores,hyphens allowed.
								</span>
							</p>
						</div>
						<div>
							<label onBlur={() => setMatchFocus(false)} htmlFor="match">
								Confirm Password:&nbsp;
								<span
									className={`${
										validMatch && pwd ? "valid" : "hide"
									} label-icon`}
								>
									<FontAwesomeIcon icon={faCircleCheck} />
								</span>
								<span
									onClick={() => {
										setPwdMatch("");
									}}
									className={`${
										validMatch || !matchPwd ? "hide" : "invalid"
									} label-icon`}
								>
									<FontAwesomeIcon icon={faCircleXmark} />
								</span>
							</label>
							<input
								type="password"
								id="match"
								ref={matchRef}
								value={matchPwd}
								onChange={(e) => setPwdMatch(e.target.value)}
								required
								aria-invalid={validName ? "false" : "true"}
								aria-describedby="matchnote"
								onFocus={() => setMatchFocus(true)}
							/>
							<p
								id="matchnote"
								className={
									matchFocus && matchPwd && !validMatch
										? "instruction"
										: "offscreen"
								}
							>
								<span className="notes">
									<FontAwesomeIcon icon={faInfoCircle} />
									&nbsp; Enter the same password as above field.
								</span>
							</p>
						</div>
						<div className="actions">
							<button
								type="submit"
								className="submit action"
								disabled={validName && validPwd && validMatch ? false : true}
							>
								Sign Up
							</button>
							<div className={showInfo ? "info show-info" : "info hidden"}>
								<span className={spinner ? "spin" : "hidden"}>
									<div className="spinner-3"></div>
								</span>
								<p ref={errRef} className={errMsg ? "errMsg" : "registering"}>
									{!errMsg ? "Registering User..." : errMsg}
								</p>
							</div>
						</div>
						<div className="already">
							<p aria-flowto="signin">Already Registered!</p>
							<button className="action" onClick={()=>{navigate("/signin")}} type="button">Sign In</button>
						</div>
						{/* <button onClick={resetFields} className="action" type="button">Reset</button> */}
					</form>
				</>
			)}
		</section>
	);
};


