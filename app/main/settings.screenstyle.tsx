import { StyleSheet} from "react-native";

export const settStyle = StyleSheet.create({
    view: {
        alignItems: "center",
        marginVertical: 22
    },
    image: {
        height: 170,
        width: 170,
        borderRadius: 85,
        borderWidth: 2,
        borderColor: 'black',
        marginBottom: 20
    },
    text: {
        fontSize: 20,
        marginBottom: 10
    },
    button: {
        marginBottom: 20
    },
    row: {
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'row'
    }
})

/* export const expenseStyle = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 25,
      paddingHorizontal: 20,
      position: 'relative',
    },
    navBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    monthText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    item: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    total: {
      fontSize: 18,
      fontWeight: 'bold',
      padding: 10,
      textAlign: 'center',
      color: 'red',
    },
    textInput: {
      marginBottom: 15,
    },
    dropdown: {
      marginBottom: 15,
    },
    dropdownContainer: {
      marginBottom: 15,
    },
    categoryButtonsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      marginVertical: 0,
    },
    categoryButton: {
      margin: 5,
    },
    expensesListContainer: {
      flex: 1,
      marginTop: -180,
    },
    categoryTotal: {
      fontSize: 18,
      fontWeight: 'bold',
      padding: 10,
      textAlign: 'center',
      color: 'blue',
    },
    add: {
      padding: 10,
      alignItems: 'center',
    },
  });
  */
  
export const friendStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    groupContainer: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    groupText: {
        fontSize: 18,
        fontWeight: '500',
    },
    button: {
        marginVertical: 10,
        padding: 15,
        backgroundColor: '#6CBDE9',
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: 'red',
        marginTop: 10,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
});


export const expenseStyle = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    card: {
      marginBottom: 10,
    },
    textInput: {
      marginBottom: 10,
    },
    button: {
      marginTop: 10,
    },
    total: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    categoryTotal: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 10,
    },
    progressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    navBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 10,
    },
    monthText: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    categoryButtonsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginVertical: 10,
    },
    categoryButton: {
      marginBottom: 5,
      flexBasis: '30%', // Adjust this value to control the button width
      marginHorizontal: 2,
    },
    categoryButtonText: {
      fontSize: 12, // Smaller font size for button text
    },
    expensesListContainer: {
      flex: 1,
      marginTop: -260,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    item: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
  });

export const groupStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    betText: {
        fontSize: 16,
        marginBottom: 8
    },
    memberContainer: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    memberText: {
        fontSize: 16,
    },
});

export const betStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 10,
    },
    betContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
    },
    betText: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 10,
    },
    input: {
        height: 40,
        borderColor: '#cccccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    voteText: {
        fontSize: 16,
        color: '#888',
        marginBottom: 8,
        marginRight: 10
    },
});