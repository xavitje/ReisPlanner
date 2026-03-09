# Reisplanner App - Nieuw Design

Deze app is volledig gerestyled volgens de **Travel Counsellors Brand Guidelines** met een modern, professioneel uiterlijk.

## 🎨 Design Kenmerken

### Kleurenpalet
- **Iceland** (Neutraal): #FBFAF6, #F9F6F0, #F2ECE1, #1D1C1A
- **Cherry** (Accent): #530E2F, #86233A, #FFD7D4, #FF5A58
- **Azure** (Secundair): #121F3F, #264F6B, #B0E2F5, #80F4FC
- **Amazon** (Actie): #013F38, #396350, #C8F2E0, #21E9A0

### Design Principes
- ✨ Plus Jakarta Sans typography
- 🎯 Afgeronde vormen (geen scherpe hoeken)
- 💫 Glassmorphism effecten
- 📱 Volledig responsive (mobiel + desktop)
- 🎭 Smooth animaties met Framer Motion
- 🌈 Gradient accenten

## 📱 Responsive Design

### Desktop (lg+)
- **Sidebar** (480px): Zoekformulier + resultaten lijst
- **Kaart gebied**: Volledige viewport met interactieve kaart
- **Glassmorphism**: Transparante elementen met blur effects

### Mobiel (<lg)
- **Header**: Gradient cherry header met zoekformulier
- **Content**: Scrollbare lijst met reis-resultaten
- **Cards**: Geoptimaliseerd voor touch interaction
- **Compact layout**: Alle informatie overzichtelijk weergegeven

## 🎯 Belangrijkste Wijzigingen

### Globale Stijl
- Achtergrond: Van donker (#0f172a) naar licht (#FBFAF6)
- Fonts: Van Geist naar Plus Jakarta Sans
- Kleuren: Van blauw/sky naar cherry/azure/amazon palet

### Componenten

#### SearchBox
- **Nieuwe iconen**: Navigation (vertrek) en MapPin (bestemming)
- **Gradient lijn**: Verticale verbinding tussen inputs
- **Swap button**: Cherry gradient met hover effecten
- **Autocomplete**: Witte cards met azure accenten

#### RouteDetails
- **Header**: Cherry gradient met reis-samenvatting
- **Timeline**: Gekleurde iconen per transport type
- **Cards**: Witte kaarten met hover effecten
- **Overstap indicator**: Cherry accent met decoratieve lijnen

#### Map
- **Kleuren**: Aangepast aan brand palette
- **Route**: Cherry (#86233A) i.p.v. blauw
- **Water**: Azure bright (#80F4FC)
- **Parken**: Amazon light (#C8F2E0)

#### Trip Cards
- **Layout**: Horizontale tijdlijn met gradient
- **Info panels**: Iceland light achtergrond
- **Hover**: Cherry light + shadow effect
- **Icons**: Ronde badges met kleuren

## 🔧 Customization

### Kleuren aanpassen
Alle kleuren zijn gedefinieerd in `globals.css` als CSS variabelen:

```css
:root {
  --iceland-light-100: #FBFAF6;
  --cherry-dark-1000: #530E2F;
  /* etc... */
}
```

### Border Radius
Alle afgeronde hoeken gebruiken:
- **Cards**: 20px - 24px
- **Buttons**: 16px - 20px
- **Inputs**: 16px
- **Badges**: 50% (volledig rond)

### Shadows
- **Standaard**: `0 8px 32px rgba(83, 14, 47, 0.08)`
- **Hover**: `0 12px 40px rgba(83, 14, 47, 0.12)`
- **XL**: `0 20px 60px rgba(83, 14, 47, 0.15)`

## 🚀 Features

- ✅ Desktop sidebar layout met kaart
- ✅ Mobiele stacked layout
- ✅ Smooth page transitions
- ✅ Glassmorphism effects
- ✅ Gradient accenten
- ✅ Custom scrollbar styling
- ✅ Toegankelijke kleuren (AAA contrast)
- ✅ Touch-friendly buttons (min 44px)
- ✅ Loading states met spinners
- ✅ Empty states met illustraties

## 🎨 Brand Compliance

Deze design volgt alle Travel Counsellors brand guidelines:
- ✓ Plus Jakarta Sans font
- ✓ Officiële kleurenpallet
- ✓ Afgeronde vormen (geen scherpe hoeken)
- ✓ Consistente spacing
- ✓ Toegankelijke contrast ratio's
- ✓ Moderne, professionele uitstraling

## 📸 Screenshots

### Desktop
- Sidebar met zoekformulier
- Resultaten lijst met hover effecten
- Kaart met route visualisatie

### Mobiel
- Compact header met gradient
- Touch-friendly kaarten
- Volledige reis details

## 🐛 Known Issues

Geen bekende issues op dit moment!

## 📄 License

Same as parent project