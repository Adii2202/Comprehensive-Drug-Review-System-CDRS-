import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:flutter/material.dart';

class ResultProvider extends ChangeNotifier {
  late String _keyfeatures;
  late String _sideeffects;
  late String _reviews;
  late double _rating;

  String get keyfeatures => _keyfeatures;
  String get sideeffects => _sideeffects;
  String get reviews => _reviews;
  double get rating => _rating;

  Future<Null> keyfeaturesnsideeffects(String text) async {
    String api = 'https://api.fda.gov/drug/label.json?search=';
    String url = api + text;
    try {
      var response = await http.get(Uri.parse(url));
      var jsonData = jsonDecode(response.body);
      _keyfeatures = jsonData['results'][0]['description'];
      _sideeffects = jsonData['results'][0]['adverse_reactions'];
      _reviews = jsonData['results'][0]['openfda']['manufacturer_name'][0];
      _rating = jsonData['results'][0]['rating'];
      notifyListeners();
    } catch (e) {
      throw e;
    }
    return null;
  }
}

class ListProvider extends ChangeNotifier {
  late List<String> _drugs;
  late List<String> _diseases;

  List<String> get drugs => _drugs;
  List<String> get diseases => _diseases;

  void getDrugs() {
    _drugs = [
      'Acetaminophen',
      'Adderall',
      'Albuterol',
      'Alprazolam',
      'Ambien',
      'Amoxicillin',
      'Aspirin',
    ];
  }

  void getDiseases() {
    _diseases = [
      'Hair Loss',
      'Hay Fever',
      'Headaches',
      'Heart Disease',
      'Heartburn',
      'Hemorrhoids',
      'Hepatitis',
      'Hepatitis A',
      'Hepatitis B',
      'Hepatitis C',
      'Hernia',
      'HIV',
      'HPV',
      'Huntington\'s Disease',
      'Hyperthyroidism',
      'Hypothyroidism',
      'Incontinence',
      'Infertility',
      'Insomnia',
      'Irritable Bowel Syndrome',
      'Kidney Cancer',
      'Kidney Stones',
      'Leukemia',
      'Liver Cancer',
      'Lung Cancer',
      'Lupus',
      'Lyme Disease',
    ];
  }
}
