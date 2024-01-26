import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:text_recognition_flutter/providers/list_provider.dart';
import 'package:text_recognition_flutter/result_screen.dart';
import 'cam_screen.dart';
import 'package:autocomplete_textfield/autocomplete_textfield.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late final TextEditingController _searchController;
  late final FocusNode _searchFocus;
  late final AutoCompleteTextField<String> _autoCompleteTextField;
  String _selected = 'disease';
  List<String> _drugList = [];
  List<String> _diseaseList = [];

  @override
  void initState() {
    super.initState();

    _diseaseList = Provider.of<ListProvider>(context, listen: false).diseases;
    _drugList = Provider.of<ListProvider>(context, listen: false).drugs;
    _searchController = TextEditingController();
    _searchFocus = FocusNode();

    _autoCompleteTextField = AutoCompleteTextField<String>(
      key: GlobalKey(),
      controller: _searchController,
      focusNode: _searchFocus,
      decoration: const InputDecoration(
        hintText: 'Type to search drug',
        contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      ),
      itemSubmitted: (String item) {
        _selected == 'drug'
            ? Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ResultScreen(text: item),
                ),
              )
            : {
                Provider.of<ListProvider>(context, listen: false)
                    .getMedFromDisease(item),
                // above provider calls future function which returns null and after success it updates drug list and to get filtered list of drugs from disease so we need to create futurebuilder here to choose from list as follows
                FutureBuilder(
                  future: Future.delayed(const Duration(seconds: 1)),
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.done) {
                      return _autoCompleteTextField;
                    } else {
                      return const CircularProgressIndicator();
                    }
                  },
                ),
              };
      },
      itemBuilder: (BuildContext context, String suggestion) {
        return ListTile(
          title: Text(suggestion),
        );
      },
      itemSorter: (String a, String b) {
        return a.compareTo(b);
      },
      suggestions: _selected == 'drug' ? _drugList : _diseaseList,
      itemFilter: (String suggestion, String query) {
        return suggestion.toLowerCase().contains(query.toLowerCase());
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('DrugRec'),
      ),
      body: Center(
        child: SingleChildScrollView(
          scrollDirection: Axis.vertical,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              DropdownButton(
                padding: const EdgeInsets.all(10),
                value: _selected,
                elevation: 26,
                dropdownColor: Colors.grey.shade200,
                iconSize: 35,
                items: const [
                  DropdownMenuItem(
                    value: 'drug',
                    child: Text('Drug'),
                  ),
                  DropdownMenuItem(
                    value: 'disease',
                    child: Text('Disease'),
                  ),
                ],
                onChanged: (value) {
                  setState(() {
                    _selected = value!;
                    _autoCompleteTextField.updateSuggestions(
                        _selected == 'drug' ? _drugList : _diseaseList);
                  });
                },
              ),
              Padding(
                padding: const EdgeInsets.all(20),
                child: Row(
                  children: [
                    Expanded(
                      child: _autoCompleteTextField,
                    ),
                    IconButton(
                      onPressed: () {
                        _searchController.clear();
                        _searchFocus.unfocus();
                      },
                      icon: const Icon(Icons.clear),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 60),
              ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const MainScreen(),
                    ),
                  );
                },
                child: const Text('Use camera to search drug'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
