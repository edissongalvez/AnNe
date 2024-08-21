const tintColorLight = 'rgba(255, 149, 0, 1)'
const tintColorDark = 'rgba(255, 159, 10, 1)'

export default {
    light: {
        textPrimary: 'rgba(0, 0, 0, 1)',
        textSecondary: 'rgba(60, 60, 67, .6)',
        textTertiary: 'rgba(60, 60, 67, .3)',
        textQuaternary: 'rgba(60, 60, 67, .18)',
        background: 'rgba(255, 255, 255, 1)',
        tint: tintColorLight,
        tabIconDefault: 'rgba(153, 153, 153, 1)',
        tabIconSelected: tintColorLight,
        fillPrimary: 'rgba(120, 120, 128, .2)',
        fillSecondary: 'rgba(120, 120, 128, .16)',
        fillTertiary: 'rgba(118, 118, 128, .12)',
        fillQuaternary: 'rgba(116, 116, 128, .8)',
        fillTint: 'rgba(255, 149, 0, .15)',
        fillDisabled: 'rgba(255, 255, 255, .12)'
    },
    dark: {
        textPrimary: 'rgba(255, 255, 255, 1)',
        textSecondary: 'rgba(235, 235, 245, .6)',
        textTertiary: 'rgba(235, 235, 245, .3)',
        textQuaternary: 'rgba(235, 235, 245, .16)',
        background: 'rgba(0, 0, 0, 1)',
        tint: tintColorDark,
        tabIconDefault: 'rgba(153, 153, 153, 1)',
        tabIconSelected: tintColorDark,
        fillPrimary: 'rgba(120, 120, 128, .36)',
        fillSecondary: 'rgba(120, 120, 120, .32)',
        fillTertiary: 'rgba(118, 118, 128, .12)',
        fillQuaternary: 'rgba(116, 116, 128, .8)',
        fillTint: 'rgba(255, 159, 10, .15)',
        fillDisabled: 'rgba(118, 118, 128, .24)'
    }
}