import { StyleSheet } from "react-native";

export const loginStyles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  regAC: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: 30
  },
  image: {
    alignSelf: 'center',
    resizeMode: 'contain',
    width: 220,
    height: 220,
    marginBottom: 10,
    marginRight: 10
  },
  scrollV: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewReg: {
    width: 300,
    marginLeft: 20
  },
  RegCont: {
    backgroundColor: 'white',
  },
  inputCont: {
    width: '90%',
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 10,
  },
  textInput: {
    backgroundColor: 'white',
    color: 'black',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 15,
  },
  regTI: {
    backgroundColor: 'white',
    color: 'black',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 15,
  },
  passwordInput: {
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16
  },
  registerButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  registerButtonText: {
    color: 'white',
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
      marginTop: 10,
      fontSize: 18,
      color: '#000',
  },
});