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

export const expenseStyle = StyleSheet.create( {
    container: {
        flex: 1,
        paddingTop: 25,
        paddingHorizontal: 20,
        position: 'relative'
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    monthText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 10,
        textAlign: 'center',
        color: 'red'
    },
    add: {
        position: 'absolute',
        bottom: 20,
        right: 20
    }
})
