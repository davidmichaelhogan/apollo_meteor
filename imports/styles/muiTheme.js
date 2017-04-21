import Colors from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#060034',
    primary2Color: '#bf1e2e',
    primary3Color: Colors.grey400,
    accent1Color: '#bf1e2e',
    accent2Color: Colors.grey100,
    accent3Color: Colors.grey500,
    pickerHeaderColor: '#060034'
  },
})

export default muiTheme
