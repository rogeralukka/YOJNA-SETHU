import json
import os

TRANSLATIONS_DIR = r"c:\Users\Roger\Documents\AA PROJECTS\1 SIH FE\src\translations"

# New general keys to add
NEW_KEYS_EN = {
    "schemeType": "Scheme Type",
    "allSchemes": "All Schemes",
    "centralGov": "Central Government",
    "stateGov": "State Government",
    "allIndia": "All India",
    "governmentLevel": "Government Level",
    "applicableStates": "Applicable States",
    "myState": "My State",
    "myStateGov": "{state} Government",
    "applicableInStates": "Applicable in {count} States",
    "stateGovBadge": "STATE",
    "centralGovBadge": "CENTRAL",
    "allLevels": "All Levels",
    "viewAllNotifications": "View All Notifications",
    "newBadgeCount": "new",
    "adminOfficer": "Admin Officer",

    # UP Schemes
    "scheme_up-kanya-sumangala": "UP Mukhyamantri Kanya Sumangala Yojana",
    "dept_up-kanya-sumangala": "Women & Child Development, UP",
    "benefit_up-kanya-sumangala": "₹25,000 Total Support",
    "benefitDetail_up-kanya-sumangala": "Direct Benefit Transfer in 6 stages",
    "deadline_up-kanya-sumangala": "Closes 15 Dec 2026",
    "desc_up-kanya-sumangala": "State welfare assistance scheme providing phased monetary support for girl child education and healthcare milestones across Uttar Pradesh.",
    "overview_up-kanya-sumangala": "The Uttar Pradesh government provides ₹25,000 in six progressive stages starting from birth registration through higher secondary and degree college enrollments.",

    "scheme_up-odop-subsidy": "UP One District One Product (ODOP) Financial Assistance",
    "dept_up-odop-subsidy": "MSME & Export Promotion, UP",
    "benefit_up-odop-subsidy": "Up to ₹20 Lakh Margin Subsidy",
    "benefitDetail_up-odop-subsidy": "25% Margin Money Grant",
    "deadline_up-odop-subsidy": "Closes 30 Nov 2026",
    "desc_up-odop-subsidy": "Margin money and capital investment subsidy for specialized indigenous craft and manufacturing enterprises in Uttar Pradesh.",
    "overview_up-odop-subsidy": "Under the ODOP Scheme of Uttar Pradesh, entrepreneurs receive up to 25% margin money subsidy (up to ₹20 Lakh) on institutional credit for setting up or expanding district-notified specialized product units.",

    "scheme_up-yuva-swarozgar": "UP Mukhyamantri Yuva Swarozgar Yojana",
    "dept_up-yuva-swarozgar": "Department of MSME, UP",
    "benefit_up-yuva-swarozgar": "Loan up to ₹25 Lakh (25% Subsidy)",
    "benefitDetail_up-yuva-swarozgar": "Low interest collateral-free credit",
    "deadline_up-yuva-swarozgar": "Always Open",
    "desc_up-yuva-swarozgar": "Self-employment credit facilitation for educated youth in Uttar Pradesh with 25% government margin money subsidy.",
    "overview_up-yuva-swarozgar": "Facilitates bank loans up to ₹25 Lakh for industrial units and up to ₹10 Lakh for service sector ventures with a 25% project cost subsidy provided by the UP state government.",

    # Maharashtra Schemes
    "scheme_maha-ladki-bahin": "Mukhyamantri Majhi Ladki Bahin Yojana",
    "dept_maha-ladki-bahin": "Women & Child Development Department, Maharashtra",
    "benefit_maha-ladki-bahin": "₹1,500 / month",
    "benefitDetail_maha-ladki-bahin": "Direct Bank Transfer to women",
    "deadline_maha-ladki-bahin": "Closes 31 Oct 2026",
    "desc_maha-ladki-bahin": "Monthly financial empowerment and nutrition assistance transfer for eligible women residents of Maharashtra.",
    "overview_maha-ladki-bahin": "Direct monthly transfer of ₹1,500 into the Aadhaar-linked bank account of eligible women aged 21-65 years residing in Maharashtra to foster financial autonomy and nutritional well-being.",

    "scheme_maha-farmer-solar": "Magel Tyala Saur Krishi Pump Yojana",
    "dept_maha-farmer-solar": "Energy Department, Maharashtra",
    "benefit_maha-farmer-solar": "Up to 95% Solar Pump Subsidy",
    "benefitDetail_maha-farmer-solar": "Off-grid irrigation solar energization",
    "deadline_maha-farmer-solar": "Closes 15 Nov 2026",
    "desc_maha-farmer-solar": "Subsidized agricultural solar pump installation scheme for farmers across Maharashtra with off-grid irrigation support.",
    "overview_maha-farmer-solar": "Offers up to 90-95% capital subsidy on standalone DC solar water pumping systems (3 HP, 5 HP, and 7.5 HP) to ensure reliable daytime irrigation for Maharashtra farmers.",

    # Karnataka Scheme
    "scheme_karnataka-yuva-nidhi": "Karnataka Yuva Nidhi Scheme",
    "dept_karnataka-yuva-nidhi": "Department of Skill Development, Karnataka",
    "benefit_karnataka-yuva-nidhi": "₹3,000 / month",
    "benefitDetail_karnataka-yuva-nidhi": "Unemployment stipend for degree graduates",
    "deadline_karnataka-yuva-nidhi": "Closes 31 Oct 2026",
    "desc_karnataka-yuva-nidhi": "Unemployment support and skill development allowance for recent degree and diploma holders in Karnataka.",
    "overview_karnataka-yuva-nidhi": "Provides ₹3,000 per month for degree holders and ₹1,500 per month for diploma holders for up to 2 years while seeking employment or undergoing government skill training.",

    # Kerala Scheme
    "scheme_kerala-startup-seed": "KSUM Innovation Grant & Seed Support",
    "dept_kerala-startup-seed": "Kerala Startup Mission, Electronics & IT Department",
    "benefit_kerala-startup-seed": "Up to ₹15 Lakh Seed Grant",
    "benefitDetail_kerala-startup-seed": "Milestone-based tech development grant",
    "deadline_kerala-startup-seed": "Closes 31 Dec 2026",
    "desc_kerala-startup-seed": "Early-stage funding and commercialization grant for technology ventures registered in Kerala.",
    "overview_kerala-startup-seed": "Offers direct financial assistance up to ₹15 Lakh for prototype development and product market fit to registered Kerala startups operating in technology, agri-tech, and healthcare sectors.",

    # Multi-state Scheme
    "scheme_western-ghats-horticulture": "Western Ghats Horticulture & Agro Processing Mission",
    "dept_western-ghats-horticulture": "Inter-State Horticulture Development Board",
    "benefit_western-ghats-horticulture": "40% Capital Subsidy",
    "benefitDetail_western-ghats-horticulture": "Post-harvest & cold chain infra grant",
    "deadline_western-ghats-horticulture": "Closes 20 Nov 2026",
    "desc_western-ghats-horticulture": "Multi-state capital grant for setting up integrated cold storage, post-harvest infrastructure, and organic fruit processing units across Western Ghats states.",
    "overview_western-ghats-horticulture": "Provides 40% capital investment subsidy for farmers, FPOs, and agro enterprises establishing certified organic pack houses, ripening chambers, and cold chain distribution hubs."
}

# Hindi translations
NEW_KEYS_HI = {
    "schemeType": "योजना प्रकार",
    "allSchemes": "सभी योजनाएं",
    "centralGov": "केंद्र सरकार",
    "stateGov": "राज्य सरकार",
    "allIndia": "अखिल भारतीय",
    "governmentLevel": "सरकारी स्तर",
    "applicableStates": "लागू राज्य",
    "myState": "मेरा राज्य",
    "myStateGov": "{state} सरकार",
    "applicableInStates": "{count} राज्यों में लागू",
    "stateGovBadge": "राज्य",
    "centralGovBadge": "केंद्र",
    "allLevels": "सभी स्तर",
    "viewAllNotifications": "सभी सूचनाएं देखें",
    "newBadgeCount": "नई",
    "adminOfficer": "प्रशासनिक अधिकारी",

    "scheme_up-kanya-sumangala": "यूपी मुख्यमंत्री कन्या सुमंगला योजना",
    "dept_up-kanya-sumangala": "महिला एवं बाल विकास, उत्तर प्रदेश",
    "benefit_up-kanya-sumangala": "₹25,000 कुल सहायता",
    "benefitDetail_up-kanya-sumangala": "6 चरणों में प्रत्यक्ष लाभ हस्तांतरण (DBT)",
    "deadline_up-kanya-sumangala": "15 दिसंबर 2026 को समाप्त",
    "desc_up-kanya-sumangala": "उत्तर प्रदेश भर में बालिकाओं की शिक्षा और स्वास्थ्य मील के पत्थरों के लिए चरणबद्ध वित्तीय सहायता योजना।",
    "overview_up-kanya-sumangala": "उत्तर प्रदेश सरकार जन्म पंजीकरण से लेकर उच्च माध्यमिक और डिग्री कॉलेज में प्रवेश तक छह चरणों में ₹25,000 प्रदान करती है।",

    "scheme_up-odop-subsidy": "यूपी एक जिला एक उत्पाद (ODOP) वित्तीय सहायता",
    "dept_up-odop-subsidy": "एमएसएमई एवं निर्यात प्रोत्साहन विभाग, उत्तर प्रदेश",
    "benefit_up-odop-subsidy": "₹20 लाख तक मार्जिन मनी सब्सिडी",
    "benefitDetail_up-odop-subsidy": "25% मार्जिन मनी अनुदान",
    "deadline_up-odop-subsidy": "30 नवंबर 2026 को समाप्त",
    "desc_up-odop-subsidy": "उत्तर प्रदेश में पारंपरिक शिल्प और विनिर्माण उद्यमों के लिए मार्जिन मनी और पूंजी निवेश सब्सिडी।",
    "overview_up-odop-subsidy": "उत्तर प्रदेश की ओडीओपी योजना के तहत उद्यमियों को जिला-अधिसूचित विशेष उत्पाद इकाइयों की स्थापना या विस्तार के लिए संस्थागत ऋण पर 25% तक मार्जिन मनी सब्सिडी मिलती है।",

    "scheme_up-yuva-swarozgar": "यूपी मुख्यमंत्री युवा स्वरोजगार योजना",
    "dept_up-yuva-swarozgar": "एमएसएमई विभाग, उत्तर प्रदेश",
    "benefit_up-yuva-swarozgar": "₹25 लाख तक ऋण (25% सब्सिडी)",
    "benefitDetail_up-yuva-swarozgar": "कम ब्याज दर पर संपार्श्विक-मुक्त ऋण",
    "deadline_up-yuva-swarozgar": "सदा खुला",
    "desc_up-yuva-swarozgar": "उत्तर प्रदेश के शिक्षित युवाओं के लिए 25% सरकारी मार्जिन मनी सब्सिडी के साथ स्वरोजगार ऋण सुविधा।",
    "overview_up-yuva-swarozgar": "औद्योगिक इकाइयों के लिए ₹25 लाख तक और सेवा क्षेत्र के उद्यमों के लिए ₹10 लाख तक के बैंक ऋण की सुविधा 25% परियोजना लागत सब्सिडी के साथ प्रदान करता है।",

    "scheme_maha-ladki-bahin": "मुख्यमंत्री माझी लाडकी बहीण योजना",
    "dept_maha-ladki-bahin": "महिला व बाल विकास विभाग, महाराष्ट्र",
    "benefit_maha-ladki-bahin": "₹1,500 / माह",
    "benefitDetail_maha-ladki-bahin": "महिलाओं को प्रत्यक्ष बैंक हस्तांतरण",
    "deadline_maha-ladki-bahin": "31 अक्टूबर 2026 को समाप्त",
    "desc_maha-ladki-bahin": "महाराष्ट्र की पात्र महिला निवासियों के लिए मासिक वित्तीय सशक्तिकरण और पोषण सहायता हस्तांतरण।",
    "overview_maha-ladki-bahin": "महाराष्ट्र में रहने वाली 21-65 वर्ष की पात्र महिलाओं के आधार से जुड़े बैंक खाते में मासिक ₹1,500 का सीधा हस्तांतरण।",

    "scheme_maha-farmer-solar": "मागेल त्याला सौर कृषी पंप योजना",
    "dept_maha-farmer-solar": "ऊर्जा विभाग, महाराष्ट्र",
    "benefit_maha-farmer-solar": "95% तक सौर पंप सब्सिडी",
    "benefitDetail_maha-farmer-solar": "ऑफ-ग्रिड सिंचाई सौर ऊर्जाकरण",
    "deadline_maha-farmer-solar": "15 नवंबर 2026 को समाप्त",
    "desc_maha-farmer-solar": "महाराष्ट्र के किसानों के लिए ऑफ-ग्रिड सिंचाई सहायता के साथ रियायती कृषि सौर पंप स्थापना योजना।",
    "overview_maha-farmer-solar": "महाराष्ट्र के किसानों के लिए विश्वसनीय दिन के समय सिंचाई सुनिश्चित करने के लिए स्टैंडअलोन डीसी सौर जल पंपिंग सिस्टम पर 90-95% तक पूंजीगत सब्सिडी प्रदान करता है।",

    "scheme_karnataka-yuva-nidhi": "कर्नाटक युवा निधि योजना",
    "dept_karnataka-yuva-nidhi": "कौशल विकास विभाग, कर्नाटक",
    "benefit_karnataka-yuva-nidhi": "₹3,000 / माह",
    "benefitDetail_karnataka-yuva-nidhi": "डिग्री स्नातकों के लिए बेरोजगारी भत्ता",
    "deadline_karnataka-yuva-nidhi": "31 अक्टूबर 2026 को समाप्त",
    "desc_karnataka-yuva-nidhi": "कर्नाटक में हाल ही के डिग्री और डिप्लोमा धारकों के लिए बेरोजगारी सहायता और कौशल विकास भत्ता।",
    "overview_karnataka-yuva-nidhi": "रोजगार की तलाश या कौशल प्रशिक्षण के दौरान 2 साल तक डिग्री धारकों को ₹3,000 प्रति माह और डिप्लोमा धारकों को ₹1,500 प्रति माह प्रदान करता है।",

    "scheme_kerala-startup-seed": "केएसयूएम इनोवेशन ग्रांट एवं सीड सपोर्ट",
    "dept_kerala-startup-seed": "केरल स्टार्टअप मिशन, इलेक्ट्रॉनिक्स एवं आईटी विभाग",
    "benefit_kerala-startup-seed": "₹15 लाख तक सीड ग्रांट",
    "benefitDetail_kerala-startup-seed": "मील का पत्थर आधारित तकनीकी विकास अनुदान",
    "deadline_kerala-startup-seed": "31 दिसंबर 2026 को समाप्त",
    "desc_kerala-startup-seed": "केरल में पंजीकृत प्रौद्योगिकी उद्यमों के लिए प्रारंभिक चरण का वित्तपोषण और व्यावसायीकरण अनुदान।",
    "overview_kerala-startup-seed": "केरल के पंजीकृत स्टार्टअप्स को प्रोटोटाइप विकास और उत्पाद बाजार फिट के लिए ₹15 लाख तक की सीधी वित्तीय सहायता प्रदान करता है।",

    "scheme_western-ghats-horticulture": "पश्चिमी घाट बागवानी एवं कृषि प्रसंस्करण मिशन",
    "dept_western-ghats-horticulture": "अंतर-राज्यीय बागवानी विकास बोर्ड",
    "benefit_western-ghats-horticulture": "40% पूंजी सब्सिडी",
    "benefitDetail_western-ghats-horticulture": "फसल कटाई बाद और कोल्ड चेन बुनियादी ढांचा अनुदान",
    "deadline_western-ghats-horticulture": "20 नवंबर 2026 को समाप्त",
    "desc_western-ghats-horticulture": "पश्चिमी घाट के राज्यों में एकीकृत कोल्ड स्टोरेज और जैविक फल प्रसंस्करण इकाइयां स्थापित करने के लिए बहु-राज्यीय पूंजी अनुदान।",
    "overview_western-ghats-horticulture": "प्रमाणित जैविक पैक हाउस, राइपनिंग चैंबर और कोल्ड चेन हब स्थापित करने वाले किसानों, एफपीओ और कृषि उद्यमों को 40% पूंजी निवेश सब्सिडी प्रदान करता है।"
}

# Marathi translations
NEW_KEYS_MR = {
    "schemeType": "योजना प्रकार",
    "allSchemes": "सर्व योजना",
    "centralGov": "केंद्र सरकार",
    "stateGov": "राज्य सरकार",
    "allIndia": "अखिल भारतीय",
    "governmentLevel": "शासकीय स्तर",
    "applicableStates": "लागू राज्ये",
    "myState": "माझे राज्य",
    "myStateGov": "{state} शासन",
    "applicableInStates": "{count} राज्यांत लागू",
    "stateGovBadge": "राज्य",
    "centralGovBadge": "केंद्र",
    "allLevels": "सर्व स्तर",
    "viewAllNotifications": "सर्व सूचना पहा",
    "newBadgeCount": "नवीन",
    "adminOfficer": "प्रशासकीय अधिकारी",

    "scheme_up-kanya-sumangala": "यूपी मुख्यमंत्री कन्या सुमंगला योजना",
    "dept_up-kanya-sumangala": "महिला व बाल विकास, उत्तर प्रदेश",
    "benefit_up-kanya-sumangala": "₹25,000 एकूण सहाय्य",
    "benefitDetail_up-kanya-sumangala": "6 टप्प्यांत थेट बँक हस्तांतरण (DBT)",
    "deadline_up-kanya-sumangala": "15 डिसेंबर 2026 रोजी समाप्त",
    "desc_up-kanya-sumangala": "उत्तर प्रदेशातील मुलींच्या शिक्षण आणि आरोग्य टप्प्यांसाठी टप्प्याटप्प्याने आर्थिक सहाय्य योजना.",
    "overview_up-kanya-sumangala": "उत्तर प्रदेश शासन जन्म नोंदणीपासून ते उच्च माध्यमिक आणि पदवी महाविद्यालय प्रवेशापर्यंत सहा टप्प्यांत ₹25,000 प्रदान करते.",

    "scheme_up-odop-subsidy": "यूपी एक जिल्हा एक उत्पादन (ODOP) आर्थिक सहाय्य",
    "dept_up-odop-subsidy": "एमएसएमई आणि निर्यात प्रोत्साहन, उत्तर प्रदेश",
    "benefit_up-odop-subsidy": "₹20 लाखांपर्यंत मार्जिन मनी सबसिडी",
    "benefitDetail_up-odop-subsidy": "25% मार्जिन मनी अनुदान",
    "deadline_up-odop-subsidy": "30 नोव्हेंबर 2026 रोजी समाप्त",
    "desc_up-odop-subsidy": "उत्तर प्रदेशातील स्थानिक हस्तकला आणि उत्पादन उपक्रमांसाठी मार्जिन मनी आणि भांडवली गुंतवणूक सबसिडी.",
    "overview_up-odop-subsidy": "उत्तर प्रदेशच्या ओडीओपी योजनेअंतर्गत उद्योजकांना जिल्हा-अधिसूचित विशेष उत्पादन युनिट्स सुरू करण्यासाठी किंवा विस्तारण्यासाठी 25% पर्यंत मार्जिन मनी सबसिडी मिळते.",

    "scheme_up-yuva-swarozgar": "यूपी मुख्यमंत्री युवा स्वयंरोजगार योजना",
    "dept_up-yuva-swarozgar": "एमएसएमई विभाग, उत्तर प्रदेश",
    "benefit_up-yuva-swarozgar": "₹25 लाखांपर्यंत कर्ज (25% सबसिडी)",
    "benefitDetail_up-yuva-swarozgar": "कमी व्याजदरात विनातारण कर्ज",
    "deadline_up-yuva-swarozgar": "नेहमी सुरू",
    "desc_up-yuva-swarozgar": "उत्तर प्रदेशातील सुशिक्षित तरुणांसाठी 25% शासकीय मार्जिन मनी सबसिडीसह स्वयंरोजगार कर्ज सुविधा.",
    "overview_up-yuva-swarozgar": "औद्योगिक युनिट्ससाठी ₹25 लाखांपर्यंत आणि सेवा क्षेत्रासाठी ₹10 लाखांपर्यंतचे बँक कर्ज 25% प्रकल्प खर्च सबसिडीसह उपलब्ध करून देते.",

    "scheme_maha-ladki-bahin": "मुख्यमंत्री माझी लाडकी बहीण योजना",
    "dept_maha-ladki-bahin": "महिला व बाल विकास विभाग, महाराष्ट्र",
    "benefit_maha-ladki-bahin": "₹1,500 / महिना",
    "benefitDetail_maha-ladki-bahin": "महिलांच्या खात्यात थेट बँक हस्तांतरण",
    "deadline_maha-ladki-bahin": "31 ऑक्टोबर 2026 रोजी समाप्त",
    "desc_maha-ladki-bahin": "महाराष्ट्रातील पात्र महिलांसाठी मासिक आर्थिक सक्षमीकरण आणि पोषण सहाय्य योजना.",
    "overview_maha-ladki-bahin": "महाराष्ट्रात राहणाऱ्या 21-65 वयोगटातील पात्र महिलांच्या आधार संलग्न बँक खात्यात दरमहा ₹1,500 थेट जमा केले जातात.",

    "scheme_maha-farmer-solar": "मागेल त्याला सौर कृषी पंप योजना",
    "dept_maha-farmer-solar": "ऊर्जा विभाग, महाराष्ट्र",
    "benefit_maha-farmer-solar": "95% पर्यंत सौर पंप सबसिडी",
    "benefitDetail_maha-farmer-solar": "ऑफ-ग्रिड सिंचन सौर ऊर्जीकरण",
    "deadline_maha-farmer-solar": "15 नोव्हेंबर 2026 रोजी समाप्त",
    "desc_maha-farmer-solar": "महाराष्ट्रातील शेतकऱ्यांसाठी ऑफ-ग्रिड सिंचन सहाय्यासह अनुदानित कृषी सौर पंप योजना.",
    "overview_maha-farmer-solar": "महाराष्ट्रातील शेतकऱ्यांना दिवसा खात्रीशीर सिंचन मिळण्यासाठी स्वतंत्र डीसी सौर जल उपसा प्रणालीवर 90-95% भांडवली सबसिडी दिली जाते.",

    "scheme_karnataka-yuva-nidhi": "कर्नाटक युवा निधी योजना",
    "dept_karnataka-yuva-nidhi": "कौशल्य विकास विभाग, कर्नाटक",
    "benefit_karnataka-yuva-nidhi": "₹3,000 / महिना",
    "benefitDetail_karnataka-yuva-nidhi": "पदवीधरांसाठी बेरोजगारी भत्ता",
    "deadline_karnataka-yuva-nidhi": "31 ऑक्टोबर 2026 रोजी समाप्त",
    "desc_karnataka-yuva-nidhi": "कर्नाटकातील पदवी आणि पदविका धारकांसाठी बेरोजगारी सहाय्य आणि कौशल्य विकास भत्ता.",
    "overview_karnataka-yuva-nidhi": "नोकरी शोधत असताना पदवीधरांना ₹3,000 प्रति महिना आणि पदविका धारकांना ₹1,500 प्रति महिना 2 वर्षांपर्यंत प्रदान केले जातात.",

    "scheme_kerala-startup-seed": "केएसयूएम इनोव्हेशन ग्रांट व सीड सपोर्ट",
    "dept_kerala-startup-seed": "केरळ स्टार्टअप मिशन, इलेक्ट्रॉनिक्स आणि आयटी विभाग",
    "benefit_kerala-startup-seed": "₹15 लाखांपर्यंत सीड ग्रांट",
    "benefitDetail_kerala-startup-seed": "टप्पा आधारित तंत्रज्ञान विकास अनुदान",
    "deadline_kerala-startup-seed": "31 डिसेंबर 2026 रोजी समाप्त",
    "desc_kerala-startup-seed": "केरळमध्ये नोंदणीकृत तंत्रज्ञान उपक्रमांसाठी प्रारंभिक टप्प्यातील निधी आणि व्यापारीकरण अनुदान.",
    "overview_kerala-startup-seed": "केरळमधील नोंदणीकृत स्टार्टअप्सना प्रोटोटाइप विकास आणि उत्पादन बाजार चाचणीसाठी ₹15 लाखांपर्यंत थेट आर्थिक सहाय्य देते.",

    "scheme_western-ghats-horticulture": "पश्चिम घाट फलोत्पादन आणि कृषी प्रक्रिया मिशन",
    "dept_western-ghats-horticulture": "आंतरराज्य फलोत्पादन विकास मंडळ",
    "benefit_western-ghats-horticulture": "40% भांडवली सबसिडी",
    "benefitDetail_western-ghats-horticulture": "कापणीनंतरच्या पायाभूत सुविधा आणि कोल्ड चेन अनुदान",
    "deadline_western-ghats-horticulture": "20 नोव्हेंबर 2026 रोजी समाप्त",
    "desc_western-ghats-horticulture": "पश्चिम घाटातील राज्यांमध्ये एकात्मिक शीतगृह आणि सेंद्रिय फळ प्रक्रिया युनिट्स उभारण्यासाठी बहुराज्यीय भांडवली अनुदान.",
    "overview_western-ghats-horticulture": "प्रमाणित सेंद्रिय पॅक हाऊस आणि कोल्ड चेन हब उभारणाऱ्या शेतकऱ्यांना, एफपीओंना आणि कृषी उद्योगांना 40% भांडवली गुंतवणूक सबसिडी प्रदान करते."
}

# Odia translations
NEW_KEYS_OR = {
    "schemeType": "ଯୋଜନା ପ୍ରକାର",
    "allSchemes": "ସମସ୍ତ ଯୋଜନା",
    "centralGov": "କେନ୍ଦ୍ର ସରକାର",
    "stateGov": "ରାଜ୍ୟ ସରକାର",
    "allIndia": "ସମଗ୍ର ଭାରତ",
    "governmentLevel": "ସରକାରୀ ସ୍ତର",
    "applicableStates": "ପ୍ରଯୁଜ୍ୟ ରାଜ୍ୟଗୁଡିକ",
    "myState": "ମୋର ରାଜ୍ୟ",
    "myStateGov": "{state} ସରକାର",
    "applicableInStates": "{count} ଟି ରାଜ୍ୟରେ ପ୍ରଯୁଜ୍ୟ",
    "stateGovBadge": "ରାଜ୍ୟ",
    "centralGovBadge": "କେନ୍ଦ୍ର",
    "allLevels": "ସମସ୍ତ ସ୍ତର",
    "viewAllNotifications": "ସମସ୍ତ ବିଜ୍ଞପ୍ତି ଦେଖନ୍ତୁ",
    "newBadgeCount": "ନୂତନ",
    "adminOfficer": "ପ୍ରଶାସନିକ ଅଧିକାରୀ",

    "scheme_up-kanya-sumangala": "ୟୁପି ମୁଖ୍ୟମନ୍ତ୍ରୀ କନ୍ୟା ସୁମଙ୍ଗଳା ଯୋଜନା",
    "dept_up-kanya-sumangala": "ମହିଳା ଓ ଶିଶୁ ବିକାଶ, ୟୁପି",
    "benefit_up-kanya-sumangala": "₹25,000 ସର୍ବମୋଟ ସହାୟତା",
    "benefitDetail_up-kanya-sumangala": "6 ଟି ପର୍ଯ୍ୟାୟରେ ପ୍ରତ୍ୟକ୍ଷ ଲାଭ ହସ୍ତାନ୍ତର",
    "deadline_up-kanya-sumangala": "15 ଡିସେମ୍ବର 2026 ରେ ଶେଷ",
    "desc_up-kanya-sumangala": "ଉତ୍ତର ପ୍ରଦେଶରେ କନ୍ୟା ସନ୍ତାନ ଶିକ୍ଷା ଏବଂ ସ୍ୱାସ୍ଥ୍ୟ ସହାୟତା ପାଇଁ ଆର୍ଥିକ ଯୋଜନା।",
    "overview_up-kanya-sumangala": "ଜନ୍ମ ପଞ୍ଜୀକରଣଠାରୁ ଆରମ୍ଭ କରି ଡିଗ୍ରୀ କଲେଜ ନାମଲେଖା ପର୍ଯ୍ୟନ୍ତ ୟୁପି ସରକାର 6 ଟି ପର୍ଯ୍ୟାୟରେ ₹25,000 ପ୍ରଦାନ କରନ୍ତି।",

    "scheme_up-odop-subsidy": "ୟୁପି ଏକ ଜିଲ୍ଲା ଏକ ଉତ୍ପାଦ (ODOP) ଆର୍ଥିକ ସହାୟତା",
    "dept_up-odop-subsidy": "ଏମଏସଏମଇ ଏବଂ ରପ୍ତାନି ପ୍ରୋତ୍ସାହନ, ୟୁପି",
    "benefit_up-odop-subsidy": "₹20 ଲକ୍ଷ ପର୍ଯ୍ୟନ୍ତ ମାର୍ଜିନ ସବସିଡି",
    "benefitDetail_up-odop-subsidy": "25% ମାର୍ଜିନ ମନି ଅନୁଦାନ",
    "deadline_up-odop-subsidy": "30 ନଭେମ୍ବର 2026 ରେ ଶେଷ",
    "desc_up-odop-subsidy": "ଉତ୍ତର ପ୍ରଦେଶରେ ସ୍ୱଦେଶୀ ହସ୍ତଶିଳ୍ପ ଏବଂ ଉତ୍ପାଦନ ୟୁନିଟ୍ ପାଇଁ ପୁଞ୍ଜି ବିନିଯୋଗ ସବସିଡି।",
    "overview_up-odop-subsidy": "ଉଦ୍ୟୋଗୀମାନଙ୍କୁ ସେମାନଙ୍କର ବିଶେଷ ଉତ୍ପାଦ ୟୁନିଟ୍ ପ୍ରତିଷ୍ଠା ପାଇଁ 25% ପର୍ଯ୍ୟନ୍ତ ମାର୍ଜିନ ମନି ସବସିଡି ପ୍ରଦାନ କରାଯାଏ।",

    "scheme_up-yuva-swarozgar": "ୟୁପି ମୁଖ୍ୟମନ୍ତ୍ରୀ ଯୁବ ସ୍ୱରୋଜଗାର ଯୋଜନା",
    "dept_up-yuva-swarozgar": "ଏମଏସଏମଇ ବିଭାଗ, ୟୁପି",
    "benefit_up-yuva-swarozgar": "₹25 ଲକ୍ଷ ପର୍ଯ୍ୟନ୍ତ ଋଣ (25% ସବସିଡି)",
    "benefitDetail_up-yuva-swarozgar": "କମ ସୁଧରେ ବିନା ବନ୍ଧକ ଋଣ",
    "deadline_up-yuva-swarozgar": "ସର୍ବଦା ଖୋଲା",
    "desc_up-yuva-swarozgar": "ଉତ୍ତର ପ୍ରଦେଶର ଶିକ୍ଷିତ ଯୁବକମାନଙ୍କ ପାଇଁ 25% ସରକାରୀ ସବସିଡି ସହିତ ସ୍ୱରୋଜଗାର ଋଣ ସୁବିଧା।",
    "overview_up-yuva-swarozgar": "ଶିଳ୍ପ ଏବଂ ସେବା କ୍ଷେତ୍ର ୟୁନିଟ୍ ପାଇଁ 25% ପ୍ରକଳ୍ପ ମୂଲ୍ୟ ସବସିଡି ସହିତ ବ୍ୟାଙ୍କ ଋଣ ପ୍ରଦାନ କରାଯାଏ।",

    "scheme_maha-ladki-bahin": "ମୁଖ୍ୟମନ୍ତ୍ରୀ ମାଝୀ ଲାଡକୀ ବହିଣ ଯୋଜନା",
    "dept_maha-ladki-bahin": "ମହିଳା ଓ ଶିଶୁ ବିକାଶ ବିଭାଗ, ମହାରାଷ୍ଟ୍ର",
    "benefit_maha-ladki-bahin": "₹1,500 / ମାସ",
    "benefitDetail_maha-ladki-bahin": "ମହିଳାଙ୍କ ଖାତାକୁ ସିଧାସଳଖ ବ୍ୟାଙ୍କ ହସ୍ତାନ୍ତର",
    "deadline_maha-ladki-bahin": "31 ଅକ୍ଟୋବର 2026 ରେ ଶେଷ",
    "desc_maha-ladki-bahin": "ମହାରାଷ୍ଟ୍ରର ମହିଳାମାନଙ୍କ ପାଇଁ ମାସିକ ଆର୍ଥିକ ସଶକ୍ତୀକରଣ ଏବଂ ପୋଷଣ ସହାୟତା ଯୋଜନା।",
    "overview_maha-ladki-bahin": "ମହାରାଷ୍ଟ୍ରର 21-65 ବର୍ଷ ବୟସର ଯୋଗ୍ୟ ମହିଳାଙ୍କ ବ୍ୟାଙ୍କ ଖାତାକୁ ପ୍ରତି ମାସରେ ₹1,500 ପ୍ରଦାନ କରାଯାଏ।",

    "scheme_maha-farmer-solar": "ମାଗେଲ ତ୍ୟାଲା ସୌର କୃଷି ପମ୍ପ ଯୋଜନା",
    "dept_maha-farmer-solar": "ଶକ୍ତି ବିଭାଗ, ମହାରାଷ୍ଟ୍ର",
    "benefit_maha-farmer-solar": "95% ପର୍ଯ୍ୟନ୍ତ ସୌର ପମ୍ପ ସବସିଡି",
    "benefitDetail_maha-farmer-solar": "ଅଫ୍-ଗ୍ରୀଡ୍ ଜଳସେଚନ ସୌର ଶକ୍ତିକରଣ",
    "deadline_maha-farmer-solar": "15 ନଭେମ୍ବର 2026 ରେ ଶେଷ",
    "desc_maha-farmer-solar": "ମହାରାଷ୍ଟ୍ରର କୃଷକମାନଙ୍କ ପାଇଁ ରିହାତି ମୂଲ୍ୟରେ କୃଷି ସୌର ପମ୍ପ ଯୋଜନା।",
    "overview_maha-farmer-solar": "କୃଷକମାନଙ୍କୁ ଦିନବେଳା ନିର୍ଭରଯୋଗ୍ୟ ଜଳସେଚନ ଯୋଗାଇବା ପାଇଁ 90-95% ପର୍ଯ୍ୟନ୍ତ ପୁଞ୍ଜି ସବସିଡି ପ୍ରଦାନ କରାଯାଏ।",

    "scheme_karnataka-yuva-nidhi": "କର୍ଣ୍ଣାଟକ ଯୁବ ନିଧି ଯୋଜନା",
    "dept_karnataka-yuva-nidhi": "ଦକ୍ଷତା ବିକାଶ ବିଭାଗ, କର୍ଣ୍ଣାଟକ",
    "benefit_karnataka-yuva-nidhi": "₹3,000 / ମାସ",
    "benefitDetail_karnataka-yuva-nidhi": "ସ୍ନାତକମାନଙ୍କ ପାଇଁ ବେକାରୀ ଭତ୍ତା",
    "deadline_karnataka-yuva-nidhi": "31 ଅକ୍ଟୋବର 2026 ରେ ଶେଷ",
    "desc_karnataka-yuva-nidhi": "କର୍ଣ୍ଣାଟକରେ ଡିଗ୍ରୀ ଏବଂ ଡିପ୍ଲୋମାଧାରୀମାନଙ୍କ ପାଇଁ ବେକାରୀ ସହାୟତା ଏବଂ ଦକ୍ଷତା ବିକାଶ ଭତ୍ତା।",
    "overview_karnataka-yuva-nidhi": "ସ୍ନାତକମାନଙ୍କୁ ମାସିକ ₹3,000 ଏବଂ ଡିପ୍ଲୋମାଧାରୀମାନଙ୍କୁ ମାସିକ ₹1,500 ଭତ୍ତା 2 ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ ପ୍ରଦାନ କରାଯାଏ।",

    "scheme_kerala-startup-seed": "କେଏସୟୁଏମ ଇନୋଭେସନ ଗ୍ରାଣ୍ଟ ଓ ସିଡ୍ ସପୋର୍ଟ",
    "dept_kerala-startup-seed": "କେରଳ ଷ୍ଟାର୍ଟଅପ୍ ମିଶନ",
    "benefit_kerala-startup-seed": "₹15 ଲକ୍ଷ ପର୍ଯ୍ୟନ୍ତ ସିଡ୍ ଗ୍ରାଣ୍ଟ",
    "benefitDetail_kerala-startup-seed": "ପ୍ରଯୁକ୍ତିବିଦ୍ୟା ବିକାଶ ଅନୁଦାନ",
    "deadline_kerala-startup-seed": "31 ଡିସେମ୍ବର 2026 ରେ ଶେଷ",
    "desc_kerala-startup-seed": "କେରଳରେ ପଞ୍ଜୀକୃତ ଟେକ୍ନୋଲୋଜି ଉଦ୍ୟୋଗ ପାଇଁ ପ୍ରାରମ୍ଭିକ ପାଣ୍ଠି ଏବଂ ଅନୁଦାନ।",
    "overview_kerala-startup-seed": "ନୂତନ ଷ୍ଟାର୍ଟଅପ୍ ଗୁଡିକୁ ପ୍ରୋଟୋଟାଇପ୍ ବିକାଶ ପାଇଁ ₹15 ଲକ୍ଷ ପର୍ଯ୍ୟନ୍ତ ଆର୍ଥିକ ସହାୟତା ପ୍ରଦାନ କରାଯାଏ।",

    "scheme_western-ghats-horticulture": "ପଶ୍ଚିମ ଘାଟ ଉଦ୍ୟାନ କୃଷି ଓ କୃଷି ପ୍ରକ୍ରିୟାକରଣ ମିଶନ",
    "dept_western-ghats-horticulture": "ଆନ୍ତଃରାଜ୍ୟ ଉଦ୍ୟାନ କୃଷି ବିକାଶ ବୋର୍ଡ",
    "benefit_western-ghats-horticulture": "40% ପୁଞ୍ଜି ସବସିଡି",
    "benefitDetail_western-ghats-horticulture": "କୋଲ୍ଡ ଚେନ୍ ଭିତ୍ତିଭୂମି ଅନୁଦାନ",
    "deadline_western-ghats-horticulture": "20 ନଭେମ୍ବର 2026 ରେ ଶେଷ",
    "desc_western-ghats-horticulture": "ପଶ୍ଚିମ ଘାଟ ରାଜ୍ୟଗୁଡିକରେ କୋଲ୍ଡ ଷ୍ଟୋରେଜ୍ ଏବଂ ଫଳ ପ୍ରକ୍ରିୟାକରଣ ୟୁନିଟ୍ ପାଇଁ ପୁଞ୍ଜି ଅନୁଦାନ।",
    "overview_western-ghats-horticulture": "ଜୈବିକ ପ୍ୟାକ୍ ହାଉସ୍ ଏବଂ କୋଲ୍ଡ ଚେନ୍ ସ୍ଥାପନ ପାଇଁ କୃଷକ ତଥା ଏଫପିଓ ମାନଙ୍କୁ 40% ସବସିଡି ପ୍ରଦାନ କରାଯାଏ।"
}

# Update all 13 language files
def main():
    en_path = os.path.join(TRANSLATIONS_DIR, "en.json")
    with open(en_path, "r", encoding="utf-8") as f:
        en_dict = json.load(f)

    # Ensure English branding is YojanaSetu
    en_dict["brandName"] = "YojanaSetu"
    
    # Merge new English keys
    for k, v in NEW_KEYS_EN.items():
        en_dict[k] = v

    with open(en_path, "w", encoding="utf-8") as f:
        json.dump(en_dict, f, ensure_ascii=False, indent=2)
    print("Updated en.json with", len(en_dict), "keys")

    # Update other active languages
    active_langs = ['hi', 'mr', 'or', 'as', 'bn', 'gu', 'kn', 'ml', 'pa', 'ta', 'te', 'ur']
    for lang in active_langs:
        lang_path = os.path.join(TRANSLATIONS_DIR, f"{lang}.json")
        if not os.path.exists(lang_path):
            continue
        with open(lang_path, "r", encoding="utf-8") as f:
            lang_dict = json.load(f)

        # Base all keys from en_dict
        updated_dict = {}
        for k in en_dict.keys():
            if k in lang_dict:
                updated_dict[k] = lang_dict[k]
            else:
                updated_dict[k] = en_dict[k]

        # Apply specific language overrides
        if lang == 'hi':
            for k, v in NEW_KEYS_HI.items():
                updated_dict[k] = v
        elif lang == 'mr':
            for k, v in NEW_KEYS_MR.items():
                updated_dict[k] = v
        elif lang == 'or':
            for k, v in NEW_KEYS_OR.items():
                updated_dict[k] = v

        with open(lang_path, "w", encoding="utf-8") as f:
            json.dump(updated_dict, f, ensure_ascii=False, indent=2)
        print(f"Updated {lang}.json with {len(updated_dict)} keys")

if __name__ == "__main__":
    main()
