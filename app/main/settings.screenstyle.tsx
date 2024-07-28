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
    textInput: {
        marginBottom: 10,
        width: '80%'
    },
    row: {
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'row'
    },
    button: {
      padding: 15,
      backgroundColor: '#000000',
      borderRadius: 15,
      alignItems: 'center',
      marginRight: 10
    },
    profButton: {
      padding: 15,
      backgroundColor: '#000000',
      borderRadius: 15,
      alignItems: 'center',
      marginBottom: 5
    },
    buttonText: {
      color: '#fff',
      fontSize: 13,
      fontWeight: 'bold',
    },
    buttView: {
      flexDirection: 'row'
    }
})
 
export const friendStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        margin: 20, 
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
        fontWeight: '700'
    },
    button: {
        marginVertical: 10,
        padding: 15,
        backgroundColor: '#000000',
        borderRadius: 12,
        alignItems: 'center'
    },
    exitButton: {
      marginVertical: 10,
      padding: 15,
      backgroundColor: '#000000',
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 120,
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
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: 'black',
        marginTop: 7,
        marginLeft: 8,
        padding: 11,
        width: '50%',
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    }
});


export const expenseStyle = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  card: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 20
  },
  textInput: {
    backgroundColor: '#f2f2f2',
    borderColor: '#black', 
    borderWidth: 1, 
    borderRadius: 5, 
    padding: 10,
    marginTop: 15
  },
  title: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18
  },
  button: {
    marginTop: 10,
    backgroundColor: 'black',
  },
  buttonLabel: {
    color: 'white', // Set the button text color to white for contrast
  },
  smallButton: {
    backgroundColor: 'black',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginBottom: 10,
  },
  smallButtonText: {
    color: 'white',
    fontSize: 14,
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
    color: 'black',
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
    backgroundColor: 'black', 
  },
  categoryButtonText: {
    fontSize: 12, // Smaller font size for button text
    color: 'white',
  },
  expensesListContainer: {
    flex: 1,
    marginTop: -230,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    flex: 1,
    flexDirection: 'column',
    color: 'black',
  },
  itemButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 10,
    color: 'black',
  },
  dropdown: {
    backgroundColor: '#f2f2f2', // Set faint grey background
  },
  dropdownContainer: {
    backgroundColor: '#f2f2f2', // Set faint grey background
  },
});

export const groupStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        margin: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 5,
        marginRight: 5,
        marginTop: 5
    },
    betText: {
        fontSize: 18,
        marginTop: 4,
        fontWeight: 'bold',
        color: '#333',
    },
    memberContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginBottom: 10, 
    },
    memberText: {
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: 20,
    },
    button: {
        marginBottom: 10,
    },
    groupId: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    betCont: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#fff',
        padding: 13,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
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
        padding: 15,
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
        borderColor: '#000000',
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
    button: {
      padding: 10,
      backgroundColor: '#000000',
      borderRadius: 100,
      alignItems: 'center',
      width: 60, 
      height: 40,
      justifyContent: 'center',
  },
});

export const winnerLog = StyleSheet.create({
  bigContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  textContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDescription: {
      marginTop: 5,
      fontSize: 16,
  },
  button: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#000000',
    borderRadius: 20,
    width: '30%',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Customize as needed
  },
  text: {
    marginTop: 10,
    fontSize: 18,
    color: '#000',
  },
})

export const analytics = StyleSheet.create({
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 10,
    alignItems: 'center'
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 15
  },
  legendColorBox: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
    color: 'black',
  },
  divider: {
    height: 1,
    backgroundColor: '#000',
    marginBottom: 10
  },
  progressBarContainer: {
    marginTop: 10,
  },
  selectedCategoryContainer: {
    marginRight: 10,
    marginBottom: 5,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 15,
    paddingBottom: 20
  },
  picker: {
    height: 50,
    marginVertical: 10,
    borderColor: 'black',
  },
  pickerWrapper: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 4,
    overflow: 'hidden',
    width: 150
  },
})