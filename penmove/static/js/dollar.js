/**
 * The $1 Unistroke Recognizer (JavaScript version)
 *
 *  Jacob O. Wobbrock, Ph.D.
 *  The Information School
 *  University of Washington
 *  Seattle, WA 98195-2840
 *  wobbrock@uw.edu
 *
 *  Andrew D. Wilson, Ph.D.
 *  Microsoft Research
 *  One Microsoft Way
 *  Redmond, WA 98052
 *  awilson@microsoft.com
 *
 *  Yang Li, Ph.D.
 *  Department of Computer Science and Engineering
 *  University of Washington
 *  Seattle, WA 98195-2840
 *  yangli@cs.washington.edu
 *
 * The academic publication for the $1 recognizer, and what should be
 * used to cite it, is:
 *
 *     Wobbrock, J.O., Wilson, A.D. and Li, Y. (2007). Gestures without
 *     libraries, toolkits or training: A $1 recognizer for user interface
 *     prototypes. Proceedings of the ACM Symposium on User Interface
 *     Software and Technology (UIST '07). Newport, Rhode Island (October
 *     7-10, 2007). New York: ACM Press, pp. 159-168.
 *     https://dl.acm.org/citation.cfm?id=1294238
 *
 * The Protractor enhancement was separately published by Yang Li and programmed
 * here by Jacob O. Wobbrock:
 *
 *     Li, Y. (2010). Protractor: A fast and accurate gesture
 *     recognizer. Proceedings of the ACM Conference on Human
 *     Factors in Computing Systems (CHI '10). Atlanta, Georgia
 *     (April 10-15, 2010). New York: ACM Press, pp. 2169-2172.
 *     https://dl.acm.org/citation.cfm?id=1753654
 *
 * This software is distributed under the "New BSD License" agreement:
 *
 * Copyright (C) 2007-2012, Jacob O. Wobbrock, Andrew D. Wilson and Yang Li.
 * All rights reserved. Last updated July 14, 2018.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    * Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *    * Neither the names of the University of Washington nor Microsoft,
 *      nor the names of its contributors may be used to endorse or promote
 *      products derived from this software without specific prior written
 *      permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Jacob O. Wobbrock OR Andrew D. Wilson
 * OR Yang Li BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
 * OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
**/
//
// Point class
//
function Point(x, y) // constructor
{
	this.X = x;
	this.Y = y;
}
//
// Rectangle class
//
function Rectangle(x, y, width, height) // constructor
{
	this.X = x;
	this.Y = y;
	this.Width = width;
	this.Height = height;
}
//
// Unistroke class: a unistroke template
//
function Unistroke(name, points) // constructor
{
	this.Name = name;
	this.Points = Resample(points, NumPoints);
	var radians = IndicativeAngle(this.Points);
	this.Points = RotateBy(this.Points, -radians);
	this.Points = ScaleTo(this.Points, SquareSize);
	this.Points = TranslateTo(this.Points, Origin);
	this.Vector = Vectorize(this.Points); // for Protractor
}
//
// Result class
//
function Result(name, score, ms) // constructor
{
	this.Name = name;
	this.Score = score;
	this.Time = ms;
}
//
// DollarRecognizer constants
//
const NumUnistrokes = 16;
const NumPoints = 64;
const SquareSize = 250.0;
const Origin = new Point(0,0);
const Diagonal = Math.sqrt(SquareSize * SquareSize + SquareSize * SquareSize);
const HalfDiagonal = 0.5 * Diagonal;
const AngleRange = Deg2Rad(45.0);
const AnglePrecision = Deg2Rad(2.0);
const Phi = 0.5 * (-1.0 + Math.sqrt(5.0)); // Golden Ratio
//
// DollarRecognizer class
//
function DollarRecognizer() // constructor
{
	//
	// one built-in unistroke per gesture type
	//
	this.Unistrokes = new Array(NumUnistrokes);
	this.Unistrokes[0] = new Unistroke("triangle", new Array(new Point(137,139),new Point(135,141),new Point(133,144),new Point(132,146),new Point(130,149),new Point(128,151),new Point(126,155),new Point(123,160),new Point(120,166),new Point(116,171),new Point(112,177),new Point(107,183),new Point(102,188),new Point(100,191),new Point(95,195),new Point(90,199),new Point(86,203),new Point(82,206),new Point(80,209),new Point(75,213),new Point(73,213),new Point(70,216),new Point(67,219),new Point(64,221),new Point(61,223),new Point(60,225),new Point(62,226),new Point(65,225),new Point(67,226),new Point(74,226),new Point(77,227),new Point(85,229),new Point(91,230),new Point(99,231),new Point(108,232),new Point(116,233),new Point(125,233),new Point(134,234),new Point(145,233),new Point(153,232),new Point(160,233),new Point(170,234),new Point(177,235),new Point(179,236),new Point(186,237),new Point(193,238),new Point(198,239),new Point(200,237),new Point(202,239),new Point(204,238),new Point(206,234),new Point(205,230),new Point(202,222),new Point(197,216),new Point(192,207),new Point(186,198),new Point(179,189),new Point(174,183),new Point(170,178),new Point(164,171),new Point(161,168),new Point(154,160),new Point(148,155),new Point(143,150),new Point(138,148),new Point(136,148)));
	this.Unistrokes[1] = new Unistroke("x", new Array(new Point(87,142),new Point(89,145),new Point(91,148),new Point(93,151),new Point(96,155),new Point(98,157),new Point(100,160),new Point(102,162),new Point(106,167),new Point(108,169),new Point(110,171),new Point(115,177),new Point(119,183),new Point(123,189),new Point(127,193),new Point(129,196),new Point(133,200),new Point(137,206),new Point(140,209),new Point(143,212),new Point(146,215),new Point(151,220),new Point(153,222),new Point(155,223),new Point(157,225),new Point(158,223),new Point(157,218),new Point(155,211),new Point(154,208),new Point(152,200),new Point(150,189),new Point(148,179),new Point(147,170),new Point(147,158),new Point(147,148),new Point(147,141),new Point(147,136),new Point(144,135),new Point(142,137),new Point(140,139),new Point(135,145),new Point(131,152),new Point(124,163),new Point(116,177),new Point(108,191),new Point(100,206),new Point(94,217),new Point(91,222),new Point(89,225),new Point(87,226),new Point(87,224)));
	this.Unistrokes[2] = new Unistroke("rectangle", new Array(new Point(78,149),new Point(78,153),new Point(78,157),new Point(78,160),new Point(79,162),new Point(79,164),new Point(79,167),new Point(79,169),new Point(79,173),new Point(79,178),new Point(79,183),new Point(80,189),new Point(80,193),new Point(80,198),new Point(80,202),new Point(81,208),new Point(81,210),new Point(81,216),new Point(82,222),new Point(82,224),new Point(82,227),new Point(83,229),new Point(83,231),new Point(85,230),new Point(88,232),new Point(90,233),new Point(92,232),new Point(94,233),new Point(99,232),new Point(102,233),new Point(106,233),new Point(109,234),new Point(117,235),new Point(123,236),new Point(126,236),new Point(135,237),new Point(142,238),new Point(145,238),new Point(152,238),new Point(154,239),new Point(165,238),new Point(174,237),new Point(179,236),new Point(186,235),new Point(191,235),new Point(195,233),new Point(197,233),new Point(200,233),new Point(201,235),new Point(201,233),new Point(199,231),new Point(198,226),new Point(198,220),new Point(196,207),new Point(195,195),new Point(195,181),new Point(195,173),new Point(195,163),new Point(194,155),new Point(192,145),new Point(192,143),new Point(192,138),new Point(191,135),new Point(191,133),new Point(191,130),new Point(190,128),new Point(188,129),new Point(186,129),new Point(181,132),new Point(173,131),new Point(162,131),new Point(151,132),new Point(149,132),new Point(138,132),new Point(136,132),new Point(122,131),new Point(120,131),new Point(109,130),new Point(107,130),new Point(90,132),new Point(81,133),new Point(76,133)));
	this.Unistrokes[3] = new Unistroke("circle", new Array(new Point(127,141),new Point(124,140),new Point(120,139),new Point(118,139),new Point(116,139),new Point(111,140),new Point(109,141),new Point(104,144),new Point(100,147),new Point(96,152),new Point(93,157),new Point(90,163),new Point(87,169),new Point(85,175),new Point(83,181),new Point(82,190),new Point(82,195),new Point(83,200),new Point(84,205),new Point(88,213),new Point(91,216),new Point(96,219),new Point(103,222),new Point(108,224),new Point(111,224),new Point(120,224),new Point(133,223),new Point(142,222),new Point(152,218),new Point(160,214),new Point(167,210),new Point(173,204),new Point(178,198),new Point(179,196),new Point(182,188),new Point(182,177),new Point(178,167),new Point(170,150),new Point(163,138),new Point(152,130),new Point(143,129),new Point(140,131),new Point(129,136),new Point(126,139)));
	this.Unistrokes[4] = new Unistroke("check", new Array(new Point(91,185),new Point(93,185),new Point(95,185),new Point(97,185),new Point(100,188),new Point(102,189),new Point(104,190),new Point(106,193),new Point(108,195),new Point(110,198),new Point(112,201),new Point(114,204),new Point(115,207),new Point(117,210),new Point(118,212),new Point(120,214),new Point(121,217),new Point(122,219),new Point(123,222),new Point(124,224),new Point(126,226),new Point(127,229),new Point(129,231),new Point(130,233),new Point(129,231),new Point(129,228),new Point(129,226),new Point(129,224),new Point(129,221),new Point(129,218),new Point(129,212),new Point(129,208),new Point(130,198),new Point(132,189),new Point(134,182),new Point(137,173),new Point(143,164),new Point(147,157),new Point(151,151),new Point(155,144),new Point(161,137),new Point(165,131),new Point(171,122),new Point(174,118),new Point(176,114),new Point(177,112),new Point(177,114),new Point(175,116),new Point(173,118)));
	this.Unistrokes[5] = new Unistroke("caret", new Array(new Point(79,245),new Point(79,242),new Point(79,239),new Point(80,237),new Point(80,234),new Point(81,232),new Point(82,230),new Point(84,224),new Point(86,220),new Point(86,218),new Point(87,216),new Point(88,213),new Point(90,207),new Point(91,202),new Point(92,200),new Point(93,194),new Point(94,192),new Point(96,189),new Point(97,186),new Point(100,179),new Point(102,173),new Point(105,165),new Point(107,160),new Point(109,158),new Point(112,151),new Point(115,144),new Point(117,139),new Point(119,136),new Point(119,134),new Point(120,132),new Point(121,129),new Point(122,127),new Point(124,125),new Point(126,124),new Point(129,125),new Point(131,127),new Point(132,130),new Point(136,139),new Point(141,154),new Point(145,166),new Point(151,182),new Point(156,193),new Point(157,196),new Point(161,209),new Point(162,211),new Point(167,223),new Point(169,229),new Point(170,231),new Point(173,237),new Point(176,242),new Point(177,244),new Point(179,250),new Point(181,255),new Point(182,257)));
	this.Unistrokes[6] = new Unistroke("zig-zag", new Array(new Point(307,216),new Point(333,186),new Point(356,215),new Point(375,186),new Point(399,216),new Point(418,186)));
	this.Unistrokes[7] = new Unistroke("arrow", new Array(new Point(68,222),new Point(70,220),new Point(73,218),new Point(75,217),new Point(77,215),new Point(80,213),new Point(82,212),new Point(84,210),new Point(87,209),new Point(89,208),new Point(92,206),new Point(95,204),new Point(101,201),new Point(106,198),new Point(112,194),new Point(118,191),new Point(124,187),new Point(127,186),new Point(132,183),new Point(138,181),new Point(141,180),new Point(146,178),new Point(154,173),new Point(159,171),new Point(161,170),new Point(166,167),new Point(168,167),new Point(171,166),new Point(174,164),new Point(177,162),new Point(180,160),new Point(182,158),new Point(183,156),new Point(181,154),new Point(178,153),new Point(171,153),new Point(164,153),new Point(160,153),new Point(150,154),new Point(147,155),new Point(141,157),new Point(137,158),new Point(135,158),new Point(137,158),new Point(140,157),new Point(143,156),new Point(151,154),new Point(160,152),new Point(170,149),new Point(179,147),new Point(185,145),new Point(192,144),new Point(196,144),new Point(198,144),new Point(200,144),new Point(201,147),new Point(199,149),new Point(194,157),new Point(191,160),new Point(186,167),new Point(180,176),new Point(177,179),new Point(171,187),new Point(169,189),new Point(165,194),new Point(164,196)));
	this.Unistrokes[8] = new Unistroke("left square bracket", new Array(new Point(140,124),new Point(138,123),new Point(135,122),new Point(133,123),new Point(130,123),new Point(128,124),new Point(125,125),new Point(122,124),new Point(120,124),new Point(118,124),new Point(116,125),new Point(113,125),new Point(111,125),new Point(108,124),new Point(106,125),new Point(104,125),new Point(102,124),new Point(100,123),new Point(98,123),new Point(95,124),new Point(93,123),new Point(90,124),new Point(88,124),new Point(85,125),new Point(83,126),new Point(81,127),new Point(81,129),new Point(82,131),new Point(82,134),new Point(83,138),new Point(84,141),new Point(84,144),new Point(85,148),new Point(85,151),new Point(86,156),new Point(86,160),new Point(86,164),new Point(86,168),new Point(87,171),new Point(87,175),new Point(87,179),new Point(87,182),new Point(87,186),new Point(88,188),new Point(88,195),new Point(88,198),new Point(88,201),new Point(88,207),new Point(89,211),new Point(89,213),new Point(89,217),new Point(89,222),new Point(88,225),new Point(88,229),new Point(88,231),new Point(88,233),new Point(88,235),new Point(89,237),new Point(89,240),new Point(89,242),new Point(91,241),new Point(94,241),new Point(96,240),new Point(98,239),new Point(105,240),new Point(109,240),new Point(113,239),new Point(116,240),new Point(121,239),new Point(130,240),new Point(136,237),new Point(139,237),new Point(144,238),new Point(151,237),new Point(157,236),new Point(159,237)));
	this.Unistrokes[9] = new Unistroke("right square bracket", new Array(new Point(112,138),new Point(112,136),new Point(115,136),new Point(118,137),new Point(120,136),new Point(123,136),new Point(125,136),new Point(128,136),new Point(131,136),new Point(134,135),new Point(137,135),new Point(140,134),new Point(143,133),new Point(145,132),new Point(147,132),new Point(149,132),new Point(152,132),new Point(153,134),new Point(154,137),new Point(155,141),new Point(156,144),new Point(157,152),new Point(158,161),new Point(160,170),new Point(162,182),new Point(164,192),new Point(166,200),new Point(167,209),new Point(168,214),new Point(168,216),new Point(169,221),new Point(169,223),new Point(169,228),new Point(169,231),new Point(166,233),new Point(164,234),new Point(161,235),new Point(155,236),new Point(147,235),new Point(140,233),new Point(131,233),new Point(124,233),new Point(117,235),new Point(114,238),new Point(112,238)));
	this.Unistrokes[10] = new Unistroke("v", new Array(new Point(89,164),new Point(90,162),new Point(92,162),new Point(94,164),new Point(95,166),new Point(96,169),new Point(97,171),new Point(99,175),new Point(101,178),new Point(103,182),new Point(106,189),new Point(108,194),new Point(111,199),new Point(114,204),new Point(117,209),new Point(119,214),new Point(122,218),new Point(124,222),new Point(126,225),new Point(128,228),new Point(130,229),new Point(133,233),new Point(134,236),new Point(136,239),new Point(138,240),new Point(139,242),new Point(140,244),new Point(142,242),new Point(142,240),new Point(142,237),new Point(143,235),new Point(143,233),new Point(145,229),new Point(146,226),new Point(148,217),new Point(149,208),new Point(149,205),new Point(151,196),new Point(151,193),new Point(153,182),new Point(155,172),new Point(157,165),new Point(159,160),new Point(162,155),new Point(164,150),new Point(165,148),new Point(166,146)));
	this.Unistrokes[11] = new Unistroke("delete", new Array(new Point(123,129),new Point(123,131),new Point(124,133),new Point(125,136),new Point(127,140),new Point(129,142),new Point(133,148),new Point(137,154),new Point(143,158),new Point(145,161),new Point(148,164),new Point(153,170),new Point(158,176),new Point(160,178),new Point(164,183),new Point(168,188),new Point(171,191),new Point(175,196),new Point(178,200),new Point(180,202),new Point(181,205),new Point(184,208),new Point(186,210),new Point(187,213),new Point(188,215),new Point(186,212),new Point(183,211),new Point(177,208),new Point(169,206),new Point(162,205),new Point(154,207),new Point(145,209),new Point(137,210),new Point(129,214),new Point(122,217),new Point(118,218),new Point(111,221),new Point(109,222),new Point(110,219),new Point(112,217),new Point(118,209),new Point(120,207),new Point(128,196),new Point(135,187),new Point(138,183),new Point(148,167),new Point(157,153),new Point(163,145),new Point(165,142),new Point(172,133),new Point(177,127),new Point(179,127),new Point(180,125)));
	this.Unistrokes[12] = new Unistroke("left curly brace", new Array(new Point(150,116),new Point(147,117),new Point(145,116),new Point(142,116),new Point(139,117),new Point(136,117),new Point(133,118),new Point(129,121),new Point(126,122),new Point(123,123),new Point(120,125),new Point(118,127),new Point(115,128),new Point(113,129),new Point(112,131),new Point(113,134),new Point(115,134),new Point(117,135),new Point(120,135),new Point(123,137),new Point(126,138),new Point(129,140),new Point(135,143),new Point(137,144),new Point(139,147),new Point(141,149),new Point(140,152),new Point(139,155),new Point(134,159),new Point(131,161),new Point(124,166),new Point(121,166),new Point(117,166),new Point(114,167),new Point(112,166),new Point(114,164),new Point(116,163),new Point(118,163),new Point(120,162),new Point(122,163),new Point(125,164),new Point(127,165),new Point(129,166),new Point(130,168),new Point(129,171),new Point(127,175),new Point(125,179),new Point(123,184),new Point(121,190),new Point(120,194),new Point(119,199),new Point(120,202),new Point(123,207),new Point(127,211),new Point(133,215),new Point(142,219),new Point(148,220),new Point(151,221)));
	this.Unistrokes[13] = new Unistroke("right curly brace", new Array(new Point(117,132),new Point(115,132),new Point(115,129),new Point(117,129),new Point(119,128),new Point(122,127),new Point(125,127),new Point(127,127),new Point(130,127),new Point(133,129),new Point(136,129),new Point(138,130),new Point(140,131),new Point(143,134),new Point(144,136),new Point(145,139),new Point(145,142),new Point(145,145),new Point(145,147),new Point(145,149),new Point(144,152),new Point(142,157),new Point(141,160),new Point(139,163),new Point(137,166),new Point(135,167),new Point(133,169),new Point(131,172),new Point(128,173),new Point(126,176),new Point(125,178),new Point(125,180),new Point(125,182),new Point(126,184),new Point(128,187),new Point(130,187),new Point(132,188),new Point(135,189),new Point(140,189),new Point(145,189),new Point(150,187),new Point(155,186),new Point(157,185),new Point(159,184),new Point(156,185),new Point(154,185),new Point(149,185),new Point(145,187),new Point(141,188),new Point(136,191),new Point(134,191),new Point(131,192),new Point(129,193),new Point(129,195),new Point(129,197),new Point(131,200),new Point(133,202),new Point(136,206),new Point(139,211),new Point(142,215),new Point(145,220),new Point(147,225),new Point(148,231),new Point(147,239),new Point(144,244),new Point(139,248),new Point(134,250),new Point(126,253),new Point(119,253),new Point(115,253)));
	this.Unistrokes[14] = new Unistroke("star", new Array(new Point(75,250),new Point(75,247),new Point(77,244),new Point(78,242),new Point(79,239),new Point(80,237),new Point(82,234),new Point(82,232),new Point(84,229),new Point(85,225),new Point(87,222),new Point(88,219),new Point(89,216),new Point(91,212),new Point(92,208),new Point(94,204),new Point(95,201),new Point(96,196),new Point(97,194),new Point(98,191),new Point(100,185),new Point(102,178),new Point(104,173),new Point(104,171),new Point(105,164),new Point(106,158),new Point(107,156),new Point(107,152),new Point(108,145),new Point(109,141),new Point(110,139),new Point(112,133),new Point(113,131),new Point(116,127),new Point(117,125),new Point(119,122),new Point(121,121),new Point(123,120),new Point(125,122),new Point(125,125),new Point(127,130),new Point(128,133),new Point(131,143),new Point(136,153),new Point(140,163),new Point(144,172),new Point(145,175),new Point(151,189),new Point(156,201),new Point(161,213),new Point(166,225),new Point(169,233),new Point(171,236),new Point(174,243),new Point(177,247),new Point(178,249),new Point(179,251),new Point(180,253),new Point(180,255),new Point(179,257),new Point(177,257),new Point(174,255),new Point(169,250),new Point(164,247),new Point(160,245),new Point(149,238),new Point(138,230),new Point(127,221),new Point(124,220),new Point(112,212),new Point(110,210),new Point(96,201),new Point(84,195),new Point(74,190),new Point(64,182),new Point(55,175),new Point(51,172),new Point(49,170),new Point(51,169),new Point(56,169),new Point(66,169),new Point(78,168),new Point(92,166),new Point(107,164),new Point(123,161),new Point(140,162),new Point(156,162),new Point(171,160),new Point(173,160),new Point(186,160),new Point(195,160),new Point(198,161),new Point(203,163),new Point(208,163),new Point(206,164),new Point(200,167),new Point(187,172),new Point(174,179),new Point(172,181),new Point(153,192),new Point(137,201),new Point(123,211),new Point(112,220),new Point(99,229),new Point(90,237),new Point(80,244),new Point(73,250),new Point(69,254),new Point(69,252)));
	this.Unistrokes[15] = new Unistroke("pigtail", new Array(new Point(81,219),new Point(84,218),new Point(86,220),new Point(88,220),new Point(90,220),new Point(92,219),new Point(95,220),new Point(97,219),new Point(99,220),new Point(102,218),new Point(105,217),new Point(107,216),new Point(110,216),new Point(113,214),new Point(116,212),new Point(118,210),new Point(121,208),new Point(124,205),new Point(126,202),new Point(129,199),new Point(132,196),new Point(136,191),new Point(139,187),new Point(142,182),new Point(144,179),new Point(146,174),new Point(148,170),new Point(149,168),new Point(151,162),new Point(152,160),new Point(152,157),new Point(152,155),new Point(152,151),new Point(152,149),new Point(152,146),new Point(149,142),new Point(148,139),new Point(145,137),new Point(141,135),new Point(139,135),new Point(134,136),new Point(130,140),new Point(128,142),new Point(126,145),new Point(122,150),new Point(119,158),new Point(117,163),new Point(115,170),new Point(114,175),new Point(117,184),new Point(120,190),new Point(125,199),new Point(129,203),new Point(133,208),new Point(138,213),new Point(145,215),new Point(155,218),new Point(164,219),new Point(166,219),new Point(177,219),new Point(182,218),new Point(192,216),new Point(196,213),new Point(199,212),new Point(201,211)));
  this.Unistrokes[0]=new Unistroke("baidu.com", new Array(new Point(67.3333740234375,67),new Point(67.74311846175539,72.73651592094069),new Point(67.74311846175539,72.7365159209407),new Point(68.15286290007327,78.47303184188138),new Point(68.15286290007327,78.47303184188141),new Point(68.56260733839115,84.20954776282208),new Point(68.56260733839115,84.20954776282211),new Point(68.66668701171875,85.66668701171875),new Point(69.3719940967171,89.89859409548635),new Point(69.3719940967171,89.89859409548637),new Point(70,93.66668701171875),new Point(70,95.59775031472178),new Point(70,95.59775031472181),new Point(70,97.66668701171875),new Point(70,100.3333740234375),new Point(70.45416520655134,101.24166285774253),new Point(70.45416520655135,101.24166285774255),new Point(71.3333740234375,103),new Point(71.3333740234375,106.78523210703814),new Point(71.3333740234375,106.78523210703817),new Point(71.3333740234375,107),new Point(71.3333740234375,108.3333740234375),new Point(71.3333740234375,112.3333740234375),new Point(71.3333740234375,112.53636290158094),new Point(71.3333740234375,112.53636290158097),new Point(71.3333740234375,115),new Point(72.37295653403518,118.11879512082996),new Point(72.3729565340352,118.11879512082999),new Point(72.66668701171875,119),new Point(72.66668701171875,121.66668701171875),new Point(72.66668701171875,123.8222607107349),new Point(72.66668701171875,123.82226071073492),new Point(72.66668701171875,124.3333740234375),new Point(72.66668701171875,125.66668701171875),new Point(72.66668701171875,129.5733915052777),new Point(72.66668701171875,129.57339150527773),new Point(72.66668701171875,129.66668701171875),new Point(72.66668701171875,135),new Point(72.66668701171875,135.3245222998205),new Point(72.66668701171875,135.32452229982053),new Point(72.66668701171875,137.66668701171875),new Point(72.66668701171875,140.3333740234375),new Point(72.66668701171875,141.0756530943633),new Point(72.66668701171875,141.07565309436333),new Point(72.66668701171875,143),new Point(72.66668701171875,146.8267838889061),new Point(72.66668701171875,146.82678388890614),new Point(72.66668701171875,147),new Point(72.66668701171875,149.66668701171875),new Point(72.66668701171875,152.3333740234375),new Point(72.66668701171875,152.5779146834489),new Point(72.66668701171875,152.57791468344894),new Point(72.66668701171875,153.66668701171875),new Point(72.66668701171875,156.3333740234375),new Point(72.66668701171875,158.3290454779917),new Point(72.66668701171875,158.32904547799174),new Point(72.66668701171875,160.3333740234375),new Point(72.66668701171875,161.66668701171875),new Point(72.66668701171875,163),new Point(72.66668701171875,164.08017627253452),new Point(72.66668701171875,164.08017627253454),new Point(72.66668701171875,165.66668701171875),new Point(72.66668701171875,167),new Point(72.66668701171875,168.3333740234375),new Point(72.66668701171875,169.83130706707732),new Point(72.66668701171875,169.83130706707735),new Point(72.66668701171875,171),new Point(72.66668701171875,173.66668701171875),new Point(72.66668701171875,175),new Point(72.66668701171875,175.58243786162012),new Point(72.66668701171875,175.58243786162015),new Point(72.66668701171875,177.66668701171875),new Point(72.66668701171875,179),new Point(71.3333740234375,177.66668701171875),new Point(71.3333740234375,177.21870766647137),new Point(71.3333740234375,177.21870766647135),new Point(71.3333740234375,176.3333740234375),new Point(71.3333740234375,172.3333740234375),new Point(71.3333740234375,171.46757687192857),new Point(71.3333740234375,171.46757687192854),new Point(71.3333740234375,171),new Point(71.3333740234375,165.71644607738577),new Point(71.3333740234375,165.71644607738574),new Point(71.3333740234375,165.66668701171875),new Point(71.3333740234375,163),new Point(72.66668701171875,160.3333740234375),new Point(72.69052585049623,160.28569525461043),new Point(72.69052585049624,160.2856952546104),new Point(74,157.66668701171875),new Point(74.89273675655838,154.98855847204052),new Point(74.89273675655839,154.9885584720405),new Point(75.3333740234375,153.66668701171875),new Point(76.66668701171875,152.3333740234375),new Point(76.66668701171875,149.86121165497448),new Point(76.66668701171875,149.86121165497445),new Point(76.66668701171875,149.66668701171875),new Point(79.3333740234375,147),new Point(80.1318028863679,145.4031422741392),new Point(80.13180288636791,145.40314227413919),new Point(80.66668701171875,144.3333740234375),new Point(80.66668701171875,143),new Point(82.45378489345615,140.31937362895007),new Point(82.45378489345616,140.31937362895005),new Point(83.3333740234375,139),new Point(84.66668701171875,139),new Point(86,137.66668701171875),new Point(86.66931664726373,136.99740100240464),new Point(86.66931664726376,136.99740100240462),new Point(87.3333740234375,136.3333740234375),new Point(88.66668701171875,135),new Point(89.97541326711581,132.38254748920588),new Point(89.97541326711584,132.38254748920582),new Point(90,132.3333740234375),new Point(91.3333740234375,131),new Point(92.66668701171875,131),new Point(94,129.66668701171875),new Point(94.4183164531694,129.24838970697255),new Point(94.41831645316945,129.2483897069725),new Point(95.3333740234375,128.3333740234375),new Point(96.66668701171875,128.3333740234375),new Point(98,128.3333740234375),new Point(99.79044760980901,128.3333740234375),new Point(99.79044760980909,128.3333740234375),new Point(100.66668701171875,128.3333740234375),new Point(103.3333740234375,128.3333740234375),new Point(104.66668701171875,128.3333740234375),new Point(105.44921724454053,128.72463018456892),new Point(105.44921724454062,128.72463018456895),new Point(107.3333740234375,129.66668701171875),new Point(110,131),new Point(110.55182331396212,131.36788501602658),new Point(110.55182331396219,131.36788501602663),new Point(114,133.66668701171875),new Point(114.71864682913116,135.103964221586),new Point(114.7186468291312,135.1039642215861),new Point(116.66668701171875,139),new Point(117.65323423901168,139.98659238853017),new Point(117.65323423901175,139.98659238853023),new Point(118,140.3333740234375),new Point(120.35268647642872,145.03869312798574),new Point(120.35268647642876,145.03869312798582),new Point(120.66668701171875,145.66668701171875),new Point(122,148.3333740234375),new Point(123.14689176482084,150.05369854563426),new Point(123.1468917648209,150.05369854563435),new Point(124.66668701171875,152.3333740234375),new Point(126.79601879168754,154.46265706724142),new Point(126.79601879168762,154.46265706724148),new Point(127.3333740234375,155),new Point(129.56546763295648,159.46428939773372),new Point(129.5654676329565,159.4642893977338),new Point(130,160.3333740234375),new Point(131.3333740234375,163),new Point(132.33074956276005,164.49608613744658),new Point(132.3307495627601,164.49608613744667),new Point(134,167),new Point(135.3333740234375,168.3333740234375),new Point(135.3333740234375,169.18951337882416),new Point(135.3333740234375,169.18951337882424),new Point(135.3333740234375,171),new Point(136.66668701171875,171),new Point(136.66668701171875,172.3333740234375),new Point(137.23641797449235,173.47283594898474),new Point(137.2364179744924,173.47283594898482),new Point(138,175),new Point(138,176.3333740234375),new Point(138,179),new Point(138.03090726908135,179.03090726908135),new Point(138.0309072690814,179.0309072690814),new Point(139.3333740234375,180.3333740234375),new Point(139.3333740234375,181.66668701171875),new Point(139.3333740234375,184.24253866942976),new Point(139.3333740234375,184.24253866942985),new Point(139.3333740234375,184.3333740234375),new Point(139.3333740234375,187),new Point(139.3333740234375,188.3333740234375),new Point(139.3333740234375,189.66668701171875),new Point(139.3333740234375,189.99366946397257),new Point(139.3333740234375,189.99366946397265),new Point(139.3333740234375,191),new Point(139.3333740234375,192.3333740234375),new Point(139.3333740234375,193.66668701171875),new Point(137.47464452107988,194.5960304915888),new Point(137.4746445210798,194.59603049158883),new Point(136.66668701171875,195),new Point(136.66668701171875,196.3333740234375),new Point(135.3333740234375,197.66668701171875),new Point(134.18157845148923,198.818429860259),new Point(134.18157845148917,198.81842986025904),new Point(134,199),new Point(132.66668701171875,200.3333740234375),new Point(130,201.66668701171875),new Point(129.55644575809694,202.1102412536218),new Point(129.55644575809688,202.11024125362187),new Point(128.66668701171875,203),new Point(124.64819413040466,205.00926943474548),new Point(124.64819413040459,205.0092694347455),new Point(123.3333740234375,205.66668701171875),new Point(120.66668701171875,207),new Point(119.36700621918784,207),new Point(119.36700621918777,207),new Point(118,207),new Point(114.35219641992558,209.43188760707142),new Point(114.35219641992552,209.43188760707145),new Point(114,209.66668701171875),new Point(110,209.66668701171875),new Point(108.81234166652695,210.26051617845528),new Point(108.81234166652689,210.2605161784553),new Point(107.3333740234375,211),new Point(106,211),new Point(103.3333740234375,211),new Point(103.23577932213003,211),new Point(103.23577932212996,211),new Point(102,211),new Point(100.66668701171875,211),new Point(99.3333740234375,211),new Point(97.67983124058391,211.8267903145778),new Point(97.67983124058385,211.82679031457783),new Point(96.66668701171875,212.3333740234375),new Point(95.3333740234375,212.3333740234375),new Point(94,212.3333740234375),new Point(92.66668701171875,212.3333740234375),new Point(92.0482910857859,212.3333740234375),new Point(92.04829108578583,212.3333740234375),new Point(90,212.3333740234375),new Point(88.66668701171875,212.3333740234375),new Point(87.3333740234375,211),new Point(86.99120128601125,210.65784292552064),new Point(86.9912012860112,210.65784292552058),new Point(86,209.66668701171875),new Point(84.66668701171875,209.66668701171875),new Point(82.53399668303072,207.53399668303072),new Point(82.53399668303067,207.53399668303067),new Point(82,207),new Point(82,205.66668701171875),new Point(79.41015739319488,203.07678512721606),new Point(79.41015739319482,203.076785127216),new Point(79.3333740234375,203),new Point(78,201.66668701171875),new Point(76.66668701171875,200.3333740234375),new Point(75.3333740234375,200.3333740234375),new Point(74.9529458375649,199.9529458375649),new Point(74.95294583756484,199.95294583756484),new Point(74,199),new Point(74,197.66668701171875),new Point(72.66668701171875,196.3333740234375),new Point(71.82909608015761,195.49574474942128),new Point(71.82909608015756,195.49574474942122),new Point(71.3333740234375,195),new Point(70,193.66668701171875),new Point(70,192.3333740234375),new Point(70,191),new Point(70,190.50226158908583),new Point(70,190.50226158908578),new Point(70,189.66668701171875),new Point(70,187),new Point(70,185.66668701171875),new Point(70,184.75113079454303),new Point(70,184.75113079454297),new Point(70,184.3333740234375),new Point(70,183),new Point(70,181.66668701171875),new Point(70,180.3333740234375),new Point(70,179.00000000000023),new Point(70,179.00000000000017),new Point(70,179)));
  this.Unistrokes[1]=new Unistroke("google.com",new Array(new Point(279.3333740234375,72.33334350585938),new Point(273.53228424973224,69.16911710949861),new Point(273.53228424973224,69.16911710949861),new Point(267.731194476027,66.00489071313784),new Point(267.731194476027,66.00489071313784),new Point(264.66668701171875,64.33334350585938),new Point(262,63),new Point(261.9040036161417,62.904003616141715),new Point(261.9040036161417,62.90400361614171),new Point(260.66668701171875,61.66668701171875),new Point(259.3333740234375,61.66668701171875),new Point(256.66668701171875,61.66668701171875),new Point(255.80856935237418,61.66668701171875),new Point(255.80856935237418,61.66668701171875),new Point(255.3333740234375,61.66668701171875),new Point(254,61.66668701171875),new Point(252.66668701171875,63),new Point(251.3333740234375,63),new Point(250.21579598613667,64.11755245875013),new Point(250.21579598613667,64.11755245875013),new Point(250,64.33334350585938),new Point(248.66668701171875,64.33334350585938),new Point(246,65.66668701171875),new Point(244.66668701171875,67),new Point(244.66668701171875,67.10242044871235),new Point(244.66668701171875,67.10242044871235),new Point(244.66668701171875,68.33334350585938),new Point(243.3333740234375,68.33334350585938),new Point(240.66668701171875,69.66668701171875),new Point(239.60442219133753,69.66668701171875),new Point(239.60442219133753,69.66668701171875),new Point(239.3333740234375,69.66668701171875),new Point(238,69.66668701171875),new Point(236.66668701171875,69.66668701171875),new Point(235.3333740234375,71),new Point(234.07144049225002,72.26190464870255),new Point(234.07144049225002,72.26190464870255),new Point(234,72.33334350585938),new Point(232.66668701171875,72.33334350585938),new Point(228.66668701171875,75),new Point(228.5029170022964,75.32754751575517),new Point(228.5029170022964,75.32754751575517),new Point(227.3333740234375,77.66668701171875),new Point(226,79),new Point(225.05769812803265,80.88464687974935),new Point(225.05769812803265,80.88464687974935),new Point(224.66668701171875,81.66668701171875),new Point(220.66668701171875,84.3333740234375),new Point(220.2524817371898,85.16178457249539),new Point(220.2524817371898,85.16178457249539),new Point(219.3333740234375,87),new Point(218,89.66668701171875),new Point(218,91),new Point(218,91.23798690293289),new Point(218,91.23798690293289),new Point(218,93.66668701171875),new Point(216.67842405720342,97.63147533797729),new Point(216.67842405720342,97.6314753379773),new Point(216.66668701171875,97.66668701171875),new Point(216.66668701171875,99),new Point(216.66668701171875,103),new Point(216.66668701171875,104.23751828753913),new Point(216.66668701171875,104.23751828753915),new Point(216.66668701171875,104.3333740234375),new Point(216.66668701171875,108.3333740234375),new Point(216.66668701171875,109.66668701171875),new Point(216.66668701171875,110.84546586980808),new Point(216.66668701171875,110.8454658698081),new Point(216.66668701171875,111),new Point(216.66668701171875,113.66668701171875),new Point(216.66668701171875,115),new Point(216.66668701171875,116.3333740234375),new Point(216.66668701171875,117.45341345207703),new Point(216.66668701171875,117.45341345207704),new Point(216.66668701171875,117.66668701171875),new Point(216.66668701171875,120.3333740234375),new Point(216.66668701171875,121.66668701171875),new Point(216.66668701171875,123),new Point(216.66668701171875,124.06136103434598),new Point(216.66668701171875,124.06136103434599),new Point(216.66668701171875,124.3333740234375),new Point(216.66668701171875,125.66668701171875),new Point(216.66668701171875,128.3333740234375),new Point(216.66668701171875,129.66668701171875),new Point(216.66668701171875,130.66930861661493),new Point(216.66668701171875,130.66930861661496),new Point(216.66668701171875,132.3333740234375),new Point(216.66668701171875,133.66668701171875),new Point(218,135),new Point(218,136.3333740234375),new Point(218.27691032302062,136.61027800853216),new Point(218.27691032302062,136.61027800853216),new Point(220.66668701171875,139),new Point(222,139),new Point(223.3333740234375,140.3333740234375),new Point(223.3399805494504,140.3399805494504),new Point(223.3399805494504,140.3399805494504),new Point(224.66668701171875,141.66668701171875),new Point(224.66668701171875,143),new Point(226,144.3333740234375),new Point(227.3333740234375,144.3333740234375),new Point(227.51275585197743,144.3333740234375),new Point(227.51275585197743,144.3333740234375),new Point(228.66668701171875,144.3333740234375),new Point(230,144.3333740234375),new Point(232.66668701171875,144.3333740234375),new Point(234,144.3333740234375),new Point(234.12070343424637,144.3333740234375),new Point(234.12070343424637,144.3333740234375),new Point(235.3333740234375,144.3333740234375),new Point(239.3333740234375,143),new Point(240.16697790291403,142.16639612052347),new Point(240.16697790291403,142.16639612052347),new Point(240.66668701171875,141.66668701171875),new Point(242,140.3333740234375),new Point(244.66668701171875,139),new Point(245.7008895196989,139),new Point(245.7008895196989,139),new Point(247.3333740234375,139),new Point(248.66668701171875,137.66668701171875),new Point(248.66668701171875,136.3333740234375),new Point(250.2377955434236,135.547801777812),new Point(250.2377955434236,135.547801777812),new Point(251.3333740234375,135),new Point(252.66668701171875,133.66668701171875),new Point(254,132.3333740234375),new Point(255.13976376566944,131.19361025776806),new Point(255.13976376566944,131.19361025776806),new Point(255.3333740234375,131),new Point(256.66668701171875,131),new Point(258,129.66668701171875),new Point(258,128.3333740234375),new Point(259.2600119881828,127.07336203525473),new Point(259.2600119881828,127.07336203525473),new Point(259.3333740234375,127),new Point(260.66668701171875,127),new Point(262,125.66668701171875),new Point(264.66668701171875,124.3333740234375),new Point(264.881545419485,124.11850578008384),new Point(264.881545419485,124.11850578008382),new Point(266,123),new Point(267.3333740234375,123),new Point(269.9445805741621,120.3887934492754),new Point(269.9445805741621,120.3887934492754),new Point(270,120.3333740234375),new Point(271.3333740234375,120.3333740234375),new Point(272.66668701171875,120.3333740234375),new Point(274,117.66668701171875),new Point(274.623295374984,117.04342016806196),new Point(274.623295374984,117.04342016806196),new Point(275.3333740234375,116.3333740234375),new Point(276.66668701171875,115),new Point(278,115),new Point(279.3333740234375,113.66668701171875),new Point(279.68635450398517,113.31370653117109),new Point(279.68635450398517,113.31370653117109),new Point(280.66668701171875,112.3333740234375),new Point(282,109.66668701171875),new Point(282,108.3333740234375),new Point(282,107.42657202623043),new Point(282,107.42657202623043),new Point(282,107),new Point(284.2957324268462,101.2607477500011),new Point(284.2957324268462,101.2607477500011),new Point(284.66668701171875,100.3333740234375),new Point(284.66668701171875,99),new Point(286,95),new Point(286,94.94060418413757),new Point(286,94.94060418413757),new Point(286,93.66668701171875),new Point(286,92.3333740234375),new Point(286,91),new Point(286,89.66668701171875),new Point(286,88.33265660186862),new Point(286,88.33265660186862),new Point(286,87),new Point(286,85.66668701171875),new Point(286,84.3333740234375),new Point(286,83),new Point(286,81.72470901959967),new Point(286,81.72470901959967),new Point(286,81.66668701171875),new Point(284.66668701171875,79),new Point(284.66668701171875,77.66668701171875),new Point(283.3333740234375,76.33334350585938),new Point(283.08618884796624,76.08616398783515),new Point(283.08618884796624,76.08616398783515),new Point(282,75),new Point(283.3333740234375,76.33334350585938),new Point(283.3333740234375,79),new Point(283.70074829142254,79.367382676643),new Point(283.70074829142254,79.36738267664302),new Point(284.66668701171875,80.33334350585938),new Point(286,81.66668701171875),new Point(286,83),new Point(286,85.0229644316412),new Point(286,85.02296443164121),new Point(286,87),new Point(286,88.3333740234375),new Point(286,89.66668701171875),new Point(286.6211595445072,91.53010877812093),new Point(286.6211595445072,91.53010877812095),new Point(287.3333740234375,93.66668701171875),new Point(287.3333740234375,95),new Point(287.3333740234375,96.3333740234375),new Point(287.3333740234375,98.02247651510382),new Point(287.3333740234375,98.02247651510382),new Point(287.3333740234375,99),new Point(287.3333740234375,101.66668701171875),new Point(287.3333740234375,103),new Point(287.3333740234375,104.3333740234375),new Point(287.3333740234375,104.63042409737277),new Point(287.3333740234375,104.63042409737277),new Point(287.3333740234375,105.66668701171875),new Point(287.3333740234375,107),new Point(288.66668701171875,109.66668701171875),new Point(288.66668701171875,110.9236256226519),new Point(288.66668701171875,110.92362562265191),new Point(288.66668701171875,111),new Point(288.66668701171875,113.66668701171875),new Point(288.66668701171875,115),new Point(288.66668701171875,117.53157320492085),new Point(288.66668701171875,117.53157320492086),new Point(288.66668701171875,117.66668701171875),new Point(288.66668701171875,120.3333740234375),new Point(288.66668701171875,121.66668701171875),new Point(288.66668701171875,123),new Point(288.66668701171875,124.1395207871898),new Point(288.66668701171875,124.13952078718981),new Point(288.66668701171875,124.3333740234375),new Point(288.66668701171875,125.66668701171875),new Point(288.66668701171875,128.3333740234375),new Point(288.66668701171875,130.74746836945874),new Point(288.66668701171875,130.74746836945877),new Point(288.66668701171875,131),new Point(288.66668701171875,132.3333740234375),new Point(288.66668701171875,133.66668701171875),new Point(288.66668701171875,136.3333740234375),new Point(288.66668701171875,137.35541595172768),new Point(288.66668701171875,137.3554159517277),new Point(288.66668701171875,139),new Point(288.66668701171875,140.3333740234375),new Point(288.66668701171875,141.66668701171875),new Point(288.66668701171875,143.9633635339966),new Point(288.66668701171875,143.96336353399664),new Point(288.66668701171875,145.66668701171875),new Point(288.66668701171875,147),new Point(288.66668701171875,149.66668701171875),new Point(288.66668701171875,150.57131111626555),new Point(288.66668701171875,150.57131111626558),new Point(288.66668701171875,151),new Point(288.66668701171875,152.3333740234375),new Point(288.66668701171875,155),new Point(288.66668701171875,157.17925869853448),new Point(288.66668701171875,157.1792586985345),new Point(288.66668701171875,157.66668701171875),new Point(288.66668701171875,159),new Point(288.66668701171875,160.3333740234375),new Point(288.66668701171875,161.66668701171875),new Point(288.66668701171875,163.78720628080342),new Point(288.66668701171875,163.78720628080345),new Point(288.66668701171875,164.3333740234375),new Point(288.66668701171875,165.66668701171875),new Point(288.66668701171875,167),new Point(288.66668701171875,168.3333740234375),new Point(288.66668701171875,170.39515386307235),new Point(288.66668701171875,170.39515386307238),new Point(288.66668701171875,171),new Point(288.66668701171875,172.3333740234375),new Point(288.66668701171875,173.66668701171875),new Point(288.66668701171875,175),new Point(288.66668701171875,176.3333740234375),new Point(288.45490351370023,176.96873421232013),new Point(288.45490351370023,176.96873421232013),new Point(287.3333740234375,180.3333740234375),new Point(287.3333740234375,181.66668701171875),new Point(287.3333740234375,183),new Point(287.05428940836964,183.27908461506783),new Point(287.05428940836964,183.27908461506783),new Point(286,184.3333740234375),new Point(284.66668701171875,185.66668701171875),new Point(283.3333740234375,187),new Point(283.0069677431003,188.30559523887322),new Point(283.0069677431003,188.30559523887322),new Point(282,192.3333740234375),new Point(282,193.66668701171875),new Point(281.20600619158637,194.46069899348572),new Point(281.20600619158637,194.46069899348572),new Point(279.3333740234375,196.3333740234375),new Point(279.3333740234375,197.66668701171875),new Point(277.4762977329206,199.52376330223564),new Point(277.4762977329206,199.52376330223566),new Point(276.66668701171875,200.3333740234375),new Point(275.3333740234375,201.66668701171875),new Point(274,203),new Point(272.66668701171875,203),new Point(272.413230139043,203.25346847518767),new Point(272.413230139043,203.2534684751877),new Point(271.3333740234375,204.3333740234375),new Point(270,204.3333740234375),new Point(267.3333740234375,205.66668701171875),new Point(266.56736106034515,205.66668701171875),new Point(266.56736106034515,205.66668701171875),new Point(266,205.66668701171875),new Point(263.3333740234375,207),new Point(262,207),new Point(260.66668701171875,207),new Point(260.27416597859394,207),new Point(260.27416597859394,207),new Point(259.3333740234375,207),new Point(258,207),new Point(256.66668701171875,207),new Point(255.3333740234375,207),new Point(254,207),new Point(253.666218396325,207),new Point(253.666218396325,207),new Point(252.66668701171875,207),new Point(251.3333740234375,207),new Point(250,207),new Point(248.66668701171875,207),new Point(247.14080710039025,206.49138112391708),new Point(247.14080710039025,206.49138112391708),new Point(244.66668701171875,205.66668701171875),new Point(243.3333740234375,205.66668701171875),new Point(240.66668701171875,205.66668701171875),new Point(240.66668701171875,205.66668701171875)));
  // //zig-zag
  // this.Unistrokes[2] = new Unistroke("test", new Array(new Point(307,216),new Point(333,186),new Point(356,215),new Point(375,186),new Point(399,216),new Point(418,186)));

  // The $1 Gesture Recognizer API begins here -- 3 methods: Recognize(), AddGesture(), and DeleteUserGestures()
	//
	this.Recognize = function(points, useProtractor)
	{
		var t0 = Date.now();
		var candidate = new Unistroke("", points);

		var u = -1;
		var b = +Infinity;
		console.log(this.Unistrokes.length);
		for (var i = 0; i < this.Unistrokes.length; i++) // for each unistroke template
		{
			var d;
			if (useProtractor)
				d = OptimalCosineDistance(this.Unistrokes[i].Vector, candidate.Vector); // Protractor
			else
				d = DistanceAtBestAngle(candidate.Points, this.Unistrokes[i], -AngleRange, +AngleRange, AnglePrecision); // Golden Section Search (original $1)
			if (d < b) {
				b = d; // best (least) distance
				u = i; // unistroke index
			}
		}
		var t1 = Date.now();
		return (u == -1) ? new Result("No match.", 0.0, t1-t0) : new Result(this.Unistrokes[u].Name, useProtractor ? (1.0 - b) : (1.0 - b / HalfDiagonal), t1-t0);
	}
	this.AddGesture = function(name, points)
	{
		this.Unistrokes[this.Unistrokes.length] = new Unistroke(name, points); // append new unistroke
    // console.log(name);
    // console.log(points)
		var num = 0;
		for (var i = 0; i < this.Unistrokes.length; i++) {
			if (this.Unistrokes[i].Name == name)
				num++;
		}
		return num;
	}
	this.DeleteUserGestures = function()
	{
		this.Unistrokes.length = NumUnistrokes; // clear any beyond the original set
		return NumUnistrokes;
	}
}
//
// Private helper functions from here on down
//
function Resample(points, n)
{
	var I = PathLength(points) / (n - 1); // interval length
	var D = 0.0;
	var newpoints = new Array(points[0]);
	for (var i = 1; i < points.length; i++)
	{
		var d = Distance(points[i-1], points[i]);
		if ((D + d) >= I)
		{
			var qx = points[i-1].X + ((I - D) / d) * (points[i].X - points[i-1].X);
			var qy = points[i-1].Y + ((I - D) / d) * (points[i].Y - points[i-1].Y);
			var q = new Point(qx, qy);
			newpoints[newpoints.length] = q; // append new point 'q'
			points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
			D = 0.0;
		}
		else D += d;
	}
	if (newpoints.length == n - 1) // somtimes we fall a rounding-error short of adding the last point, so add it if so
		newpoints[newpoints.length] = new Point(points[points.length - 1].X, points[points.length - 1].Y);
	return newpoints;
}
function IndicativeAngle(points)
{
	var c = Centroid(points);
	return Math.atan2(c.Y - points[0].Y, c.X - points[0].X);
}
function RotateBy(points, radians) // rotates points around centroid
{
	var c = Centroid(points);
	var cos = Math.cos(radians);
	var sin = Math.sin(radians);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = (points[i].X - c.X) * cos - (points[i].Y - c.Y) * sin + c.X
		var qy = (points[i].X - c.X) * sin + (points[i].Y - c.Y) * cos + c.Y;
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function ScaleTo(points, size) // non-uniform scale; assumes 2D gestures (i.e., no lines)
{
	var B = BoundingBox(points);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = points[i].X * (size / B.Width);
		var qy = points[i].Y * (size / B.Height);
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function TranslateTo(points, pt) // translates points' centroid
{
	var c = Centroid(points);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = points[i].X + pt.X - c.X;
		var qy = points[i].Y + pt.Y - c.Y;
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function Vectorize(points) // for Protractor
{
	var sum = 0.0;
	var vector = new Array();
	for (var i = 0; i < points.length; i++) {
		vector[vector.length] = points[i].X;
		vector[vector.length] = points[i].Y;
		sum += points[i].X * points[i].X + points[i].Y * points[i].Y;
	}
	var magnitude = Math.sqrt(sum);
	for (var i = 0; i < vector.length; i++)
		vector[i] /= magnitude;
	return vector;
}
function OptimalCosineDistance(v1, v2) // for Protractor
{
	var a = 0.0;
	var b = 0.0;
	for (var i = 0; i < v1.length; i += 2) {
		a += v1[i] * v2[i] + v1[i+1] * v2[i+1];
		b += v1[i] * v2[i+1] - v1[i+1] * v2[i];
	}
	var angle = Math.atan(b / a);
	return Math.acos(a * Math.cos(angle) + b * Math.sin(angle));
}
function DistanceAtBestAngle(points, T, a, b, threshold)
{
	var x1 = Phi * a + (1.0 - Phi) * b;
	var f1 = DistanceAtAngle(points, T, x1);
	var x2 = (1.0 - Phi) * a + Phi * b;
	var f2 = DistanceAtAngle(points, T, x2);
	while (Math.abs(b - a) > threshold)
	{
		if (f1 < f2) {
			b = x2;
			x2 = x1;
			f2 = f1;
			x1 = Phi * a + (1.0 - Phi) * b;
			f1 = DistanceAtAngle(points, T, x1);
		} else {
			a = x1;
			x1 = x2;
			f1 = f2;
			x2 = (1.0 - Phi) * a + Phi * b;
			f2 = DistanceAtAngle(points, T, x2);
		}
	}
	return Math.min(f1, f2);
}
function DistanceAtAngle(points, T, radians)
{
	var newpoints = RotateBy(points, radians);
	return PathDistance(newpoints, T.Points);
}
function Centroid(points)
{
	var x = 0.0, y = 0.0;
	for (var i = 0; i < points.length; i++) {
		x += points[i].X;
		y += points[i].Y;
	}
	x /= points.length;
	y /= points.length;
	return new Point(x, y);
}
function BoundingBox(points)
{
	var minX = +Infinity, maxX = -Infinity, minY = +Infinity, maxY = -Infinity;
	for (var i = 0; i < points.length; i++) {
		minX = Math.min(minX, points[i].X);
		minY = Math.min(minY, points[i].Y);
		maxX = Math.max(maxX, points[i].X);
		maxY = Math.max(maxY, points[i].Y);
	}
	return new Rectangle(minX, minY, maxX - minX, maxY - minY);
}
function PathDistance(pts1, pts2)
{
	var d = 0.0;
	for (var i = 0; i < pts1.length; i++) // assumes pts1.length == pts2.length
		d += Distance(pts1[i], pts2[i]);
	return d / pts1.length;
}
function PathLength(points)
{
	var d = 0.0;
	for (var i = 1; i < points.length; i++)
		d += Distance(points[i - 1], points[i]);
	return d;
}
function Distance(p1, p2)
{
	var dx = p2.X - p1.X;
	var dy = p2.Y - p1.Y;
	return Math.sqrt(dx * dx + dy * dy);
}
function Deg2Rad(d) {
	return (d * Math.PI / 180.0);
}

export {
  DollarRecognizer,Point
}
