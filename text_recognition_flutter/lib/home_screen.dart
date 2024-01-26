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
  AutoCompleteTextField<String>? _autoCompleteTextField;
  String _selected = 'drug';

  late List<String> _drugList;
  late List<String> _diseaseList;

  Future<Null> _getDrugNames() async {
    await Provider.of<ListProvider>(context, listen: false).getdrugNames();
    _drugList = Provider.of<ListProvider>(context, listen: false).drugs;
    _diseaseList = Provider.of<ListProvider>(context, listen: false).diseases;
    _autoCompleteTextField!
        .updateSuggestions(_selected == 'drug' ? _drugList : _diseaseList);
  }

  Future<Null> _getDiseaseNames() async {
    await Provider.of<ListProvider>(context, listen: false).getdiseaseNames();
    _drugList = Provider.of<ListProvider>(context, listen: false).drugs;
    _diseaseList = Provider.of<ListProvider>(context, listen: false).diseases;
    _autoCompleteTextField!
        .updateSuggestions(_selected == 'drug' ? _drugList : _diseaseList);
  }

  @override
  void initState() {
    super.initState();
    _getDrugNames();
    _getDiseaseNames();
    _searchController = TextEditingController();
    _searchFocus = FocusNode();

    _diseaseList = Provider.of<ListProvider>(context, listen: false).diseases;
    _drugList = Provider.of<ListProvider>(context, listen: false).drugs;

    _autoCompleteTextField = AutoCompleteTextField<String>(
      key: GlobalKey(),
      controller: _searchController,
      focusNode: _searchFocus,
      decoration: InputDecoration(
        hintText: 'Type to search drug',
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(15.0),
        ),
        contentPadding: const EdgeInsets.all(16.0),
        filled: true,
        fillColor: Colors.white,
      ),
      itemSubmitted: (String item) {
        Provider.of<ListProvider>(context, listen: false)
            .getMedFromDisease(item)
            .then(
              (value) => showDialog(
                context: context,
                builder: (context) => AlertDialog(
                  title: const Text('Drug List'),
                  content: SingleChildScrollView(
                    child: Column(
                      children:
                          Provider.of<ListProvider>(context, listen: false)
                              .drugs
                              .map((e) => ListTile(
                                    title: Text(e),
                                    onTap: () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (context) => ResultScreen(
                                            text: e,
                                          ),
                                        ),
                                      );
                                    },
                                  ))
                              .toList(),
                    ),
                  ),
                  actions: [
                    TextButton(
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      child: const Text('Cancel'),
                    ),
                  ],
                ),
              ),
            )
            .catchError(
              (e) => showDialog(
                context: context,
                builder: (context) => AlertDialog(
                  title: const Text('Error'),
                  content: SingleChildScrollView(
                    child: Text(e.toString()),
                  ),
                  actions: [
                    TextButton(
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      child: const Text('OK'),
                    ),
                  ],
                ),
              ),
            );
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
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              DropdownButton(
                padding: const EdgeInsets.all(12),
                value: _selected,
                elevation: 4,
                icon: const Icon(Icons.arrow_drop_down),
                iconSize: 24,
                borderRadius: BorderRadius.circular(15.0),
                dropdownColor: Colors.grey.shade200,
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
                    _selected = value.toString();
                    _autoCompleteTextField!.updateSuggestions(
                        _selected == 'drug' ? _drugList : _diseaseList);
                  });
                },
              ),
              const SizedBox(height: 20),
              Padding(
                padding: const EdgeInsets.all(20),
                child: Row(
                  children: [
                    Expanded(
                      child: _autoCompleteTextField!,
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
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const MainScreen(),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                    vertical: 15,
                    horizontal: 40,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15.0),
                  ),
                ),
                child: const Text(
                  'Use camera to search drug',
                  style: TextStyle(fontSize: 18),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
