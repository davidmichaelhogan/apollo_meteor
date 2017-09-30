import Colors from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#3499cc',
    primary2Color: '#996699',
    primary3Color: Colors.grey400,
    accent1Color: '#996699',
    accent2Color: Colors.grey100,
    accent3Color: Colors.grey500,
    pickerHeaderColor: '#3499cc'
  },
})

export default muiTheme
