//tạo function DOM để thuận tiện việc DOM lấy dữ liệu người dùng
function DOM(selector) {
  return document.querySelector(selector);
}

// Hàm display hiển thị ra giao diện
function display(nhanViens) {
  // dùng hàm reduce để duyệt mảng nhanViens
  // tạo 1 biến để hứng kết quả
  let ketQua = nhanViens.reduce((result, nhanVien) => {
    return (
      result +
      `
      <tr>
      <td>${nhanVien.id}</td>
      <td>${nhanVien.name}</td>
      <td>${nhanVien.email}</td>
      <td>${nhanVien.datePicker}</td>
      <td>${nhanVien.position}</td>
      <td>${new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "VND",
      }).format(nhanVien.calcLuong())}</td>
      <td>${nhanVien.rank()}</td>
      <td><button class="btn btn-success" onclick="editNhanVien('${
        nhanVien.id
      }')">Edit</button></td>
      <td><button class="btn btn-danger" onclick="deleteNhanVien('${
        nhanVien.id
      }')">Delete</button></td>
    </tr>
    `

      // nút delete : muốn xóa chính nút mình bấm thì cần phải truyền vào tham số xác định xem nút delete đó đang có nắm giữ id hoặc (cột mốc nào đó) để mà xóa đúng vị trí mình muốn
      // lưu ý khi truyền tham số vào func kiểu như trên thì nên bỏ tham số vào ngoặc kép or đơn để biến nó thành chuỗi , nếu ko thì nó sẽ là dữ liệu số vd : onclick="deleteNhanVien('${nhanVien.id}')"

      // nút Edit : muốn chỉnh sửa thì trước tiên ta phải fill ngược thông tin lên ô input mà muốn fill thì phải xác định được nút edit đang nằm ở vị trí nào , nên ta cho nó cột mốc 'id' vào
      // lưu ý HTML chỉ cho truyền vào tham số boolean , number , string thôi
    );
  }, "");

  // DOM tới tbody và gắn biến chứa kết quả
  DOM("#tableDanhSach").innerHTML = ketQua;
}

// tạo function contructor đối tượng NhanVien để khởi tạo nhanh thông tin nhân viên
function NhanVien(
  id,
  name,
  email,
  password,
  datePicker,
  salary,
  position,
  workTime
) {
  this.id = id;
  this.name = name;
  this.email = email;
  this.password = password;
  this.datePicker = datePicker;
  this.salary = salary;
  this.position = position;
  this.workTime = workTime;
}

//tạo phương thức để tính tổng lương
NhanVien.prototype.calcLuong = function () {
  // tạo biến chứa tiền lương
  let tongLuong = 0;
  if (this.position === "Giám Đốc") {
    tongLuong = this.salary * 3;
  } else if (this.position === "Trưởng phòng") {
    tongLuong = this.salary * 2;
  } else if (this.position === "Nhân viên") {
    tongLuong = this.salary;
  }

  return tongLuong;
};

// tạo phương thức xếp loại nhân viên
NhanVien.prototype.rank = function () {
  //tạo 1 biến chuỗi rỗng để chứa tên xếp loại
  let xepLoai = "";
  if (this.workTime >= 192) {
    xepLoai = "Xuất sắc";
  } else if (this.workTime >= 176) {
    xepLoai = "Giỏi";
  } else if (this.workTime >= 160) {
    xepLoai = "Khá";
  } else {
    xepLoai = "Trung Bình";
  }
  return xepLoai;
};

// tạo 1 mảng lưu object nhân viên sẽ được thêm mới vào khi nhấn nút addNhanVien
let nhanViens = [];
//======== Add nhân viên
function addNhanVien() {
  //B1 DOM lấy thông tin từ người dùng
  let id = DOM("#tknv").value;
  let name = DOM("#name").value;
  let email = DOM("#email").value;
  let password = DOM("#password").value;
  let datePicker = DOM("#datepicker").value;
  let salary = DOM("#luongCB").value * 1;
  let position = DOM("#chucvu").value;
  let workTime = DOM("#gioLam").value * 1;

  // kiểm tra validate
  let validForm = validateForm();
  // nếu kiểm tra thấy ng dùng nhập ko đúng thì return false để kết thúc hàm và vô hiệu hóa input
  if (!validForm) {
    return false;
  }

  // B2 tạo object nhanVien với các value trên , mỗi lần nhấn nút addNhanVien thì thông tin nhân viên mới sẽ đc thêm vào mảng nhanViens
  let nhanVien = new NhanVien(
    id,
    name,
    email,
    password,
    datePicker,
    salary,
    position,
    workTime
  );

  // B3 : thêm nhaVien vào mảng nhanViens
  nhanViens.push(nhanVien);

  // B4 : hiển thị ra giao diện
  display(nhanViens);

  // B5 : thêm reset các ô input
  resetForm();
}

// ============= Nút Delete Nhân viên
// gọi hàm
function deleteNhanVien(nhanVienID) {
  //"nhanVienID"  là tham số id(nhanVien.id) của nhân viên mình muốn xóa array nhanViens(danh sách nhân viên)

  //  Cách 1, dùng nhanVienID tìm index bằng hàm findIndex và xoá bằng hàm splice
  //  nhanViens = [{id: 1}, {id: 2}, {id: 3}], nhanVienID = 2
  // Tạo biến index để hứng giá trị trả
  //   let index = nhanViens.findIndex((nhanVien) => {
  //     // return về biểu thức có điều kiện giá trị boolean,
  //     // nếu là true, trả ra index của phần tử này.
  //     // nếu là false thì tiếp tục duyệt qua phần tử tiếp theo.
  //     // trả ra -1 nếu không có bất kì phần tử nào return về true
  //     return nhanVien.id === nhanVienID;
  //   });

  //   if (index !== -1) {
  //     nhanViens.splice(index, 1);
  //   }

  // cách 2 : dùng hàm filter
  nhanViens = nhanViens.filter((nhanVien) => {
    // đặt điều kiện nếu nhanVien.id !== nhanVienID ( trả ra true) thì sẽ lấy những giá trị đó trả ra bên ngoài mảng mới , trả ra false thì bỏ qua
    return nhanVien.id !== nhanVienID;
  });

  // Sau khi thay đổi dữ liệu của mảng array, ta cần gọi lại hàm display và truyền vào array nhanViens để cập nhật lại giao diện
  display(nhanViens);
}

// =========== Search nhân viên theo xếp loại
function searchNhanVien() {
  //B1 : DOM lấy giá trị từ input của ng dùng nhập vào tìm kím
  let searchName = DOM("#searchName").value;

  // biến giá trị searchName người dùng nhập vào và ta không cần phải phân biệt hoa thường , lưu ý chỉ khi biến có giá trị là string thì ms sài đc hàm 'toLowerCase()' này

  searchName = searchName.toLowerCase();

  //B2 : dùng hàm filter để lọc tìm kiếm
  //Lưu ý trường hợp tìm kím thì không đc gán giá trị filter tìm được ngược lại cho array nhanViens vì nó sẽ xóa phần tử trong đó , thay vào đó ta nên tạo 1 biến mới để hứng giá trị để tránh không làm mất dữ liệu ban đầu khi ta bỏ tìm kiếm
  let newNhanviens = nhanViens.filter((nhanVien) => {
    // tạo 1 biến để chuyển đổi giá trị xếp loại thành dạng viết thường
    let xepLoai = nhanVien.rank().toLowerCase();
    //includes() là hàm dùng cho string : với mục đích tìm kiếm chuỗi con
    //vd xepLoai.includes(searchName) ; 'xepLoai' là chuỗi cha và 'searchName' chuỗi con , và hàm sẽ đi tìm xem giá trị 'searchName' có nằm trong chuỗi cha nó hay không , nếu có(dù giống ít) thì nó cũng trả ra 'true'
    //Lưu ý : mọi chuỗi rỗng luôn luôn khớp với chuỗi cha
    return xepLoai.includes(searchName);
    // nếu 'searchName' có trong chuỗi cha 'xepLoai' thì trả ra true , ngược lại , và mọi lần true thì nó sẽ return kết quả ra biến 'newNhanviens'
  });

  display(newNhanviens);
}

// ============ Edit nhân viên
function editNhanVien(nhanVienId) {
  // hoạt động tương tự hàm findIndex , tuy nhiên thay vì trả về chỉ mục(index) thì nó trả về chính giá trị phần tử mà nó duyệt
  // trường hợp ko tìm thấy thì nó sẻ trả về undefined
  let chinhSua = nhanViens.find((nhanVien) => {
    return nhanVien.id === nhanVienId;
  });
  // kiểm tra nếu ko tìm thấy thì return ko chạy hàm
  if (!chinhSua) {
    return;
  }
  // B1 : DOM và gán ngược thông tin
  DOM("#tknv").value = chinhSua.id;
  DOM("#name").value = chinhSua.name;
  DOM("#email").value = chinhSua.email;
  DOM("#password").value = chinhSua.password;
  DOM("#datepicker").value = chinhSua.datePicker;
  DOM("#luongCB").value = chinhSua.salary;
  DOM("#chucvu").value = chinhSua.position;
  DOM("#gioLam").value = chinhSua.workTime;

  // Bonus thêm : thường khi edit thì ID người dùng ko đc thay đổi để cố định vị trí tìm kiếm , và nút addNhanVien sẽ ko đc sử dụng
  DOM("#tknv").disabled = true;
  DOM("#btnThemNV").disabled = true;
}

// ==== Cập nhật thông tin nhân viên
DOM("#btnCapNhat").onclick = function () {
  // B1 :  DOM lấy lại thông tin trên trình duyệt mà người dùng chỉnh sửa

  let id = DOM("#tknv").value;
  let name = DOM("#name").value;
  let email = DOM("#email").value;
  let password = DOM("#password").value;
  let datePicker = DOM("#datepicker").value;
  let salary = DOM("#luongCB").value * 1;
  let position = DOM("#chucvu").value;
  let workTime = DOM("#gioLam").value * 1;

  //kiểm tra validation
  if(!validateForm()){
    return false
  }

  //B2 : tạo object nhanVien chứa các thông tin đã chỉnh sửa ,
  let nhanVien = new NhanVien(
    id,
    name,
    email,
    password,
    datePicker,
    salary,
    position,
    workTime
  );

  // B3 : cập nhật lại thông tin nhân viên mà ko phải là thêm mới vào mảng , dựa vào id mà tìm kiếm phần tử mà mình muốn cập nhật
  let index = nhanViens.findIndex((nhanVienId) => {
    return nhanVienId.id === nhanVien.id;
  });
  //gán giá trị 'nhanVien' cho mảng chứa chỉ mục đã tìm được nhanViens[index]
  nhanViens[index] = nhanVien;

  //B4 :  hiển thị ra giao diện
  display(nhanViens);

  //B5 : reset lại form
  resetForm()
};

// Bonus Hàm reset form để khi nhấn vào nút thêm thì reset lại các ô input thành rỗng
function resetForm() {
  DOM("#tknv").value = "";
  DOM("#name").value = "";
  DOM("#email").value = "";
  DOM("#password").value = "";
  DOM("#datepicker").value = "";
  DOM("#luongCB").value = "";
  DOM("#chucvu").value = 0;
  DOM("#gioLam").value = "";

  // khi bấm nút cập nhật thì trả về nút add  và ô input ID về trạng thái ban đầu
  DOM("#tknv").disabled = false;
  DOM("#btnThemNV").disabled = false;
}



//===========Validatetion====================================================
//============Hàm kiểm tra ID nhân viên
function validID() {
  //B1 DOM lấy thông tin ID của người dùng từ trình duyệt
  let valID = DOM("#tknv").value;

  // DOM tới thẻ in ra thông báo
  let spanVal = DOM("#tbTKNV");
  spanVal.style.display = "block";

  // Xử lý :
  // Kiểm tra rỗng
  if (!valID) {
    spanVal.innerHTML = "ID không được để trống";
    return false;
  }

  // kiểm tra số lượng kí tự ID không đc ít hơn 4 chữ số và nhiều hơn 6 chữ số
  if (valID.length < 4 || valID.length > 6) {
    spanVal.innerHTML = "Tài khoản tối đa 4 - 6 ký tự";
    return false;
  }

  // nếu ng dùng nhập đúng thì trả về thẻ rỗng
  spanVal.innerHTML = "";
  return true;
}

//=========== hàm kiểm tra tên nhân viên
function validName() {
  //B1 DOM lấy thông tin tên của người dùng từ trình duyệt
  let valName = DOM("#name").value;

  // DOM tới thẻ in ra thông báo
  let spanVal = DOM("#tbTen");
  spanVal.style.display = "block";

  // kiểm tra tên ko đc để trống
  if (!valName) {
    spanVal.innerHTML = "Tên không được để trống";
    return false;
  }
  // kiểm tra tên chỉ được nhập chữ ko đc nhập số or kí hiệu nào khác
  let regex = /[a-zA-Z]/;
  if (!regex.test(valName)) {
    spanVal.innerHTML = "Tên không đúng định dạng";
  }

  // nếu ng dùng nhập đúng thì trả về thẻ rỗng
  spanVal.innerHTML = "";
  return true;
}

//============= Hàm kiêm tra email
function validEmail() {
  //B1 DOM lấy thông tin tên của người dùng từ trình duyệt
  let valEmail = DOM("#email").value;

  // DOM tới thẻ in ra thông báo
  let spanVal = DOM("#tbEmail");
  spanVal.style.display = "block";

  // kiểm tra rỗng
  if (!valEmail) {
    spanVal.innerHTML = "Email không được để trống";
    return false;
  }

  // kiểm tra định dạng
  let regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!regex.test(valEmail)) {
    spanVal.innerHTML = "Email không đúng định dạng";
    return false;
  }

  // nếu ng dùng nhập đúng thì trả về thẻ rỗng
  spanVal.innerHTML = "";
  return true;
}

//===== Hàm kiểm tra password
function validPassWord() {
  //B1 DOM lấy thông tin tên của người dùng từ trình duyệt
  let valPassWord = DOM("#password").value;

  // DOM tới thẻ in ra thông báo
  let spanVal = DOM("#tbMatKhau");
  spanVal.style.display = "block";

  // kiểm tra rỗng
  if (!valPassWord) {
    spanVal.innerHTML = "Password không được để trống";
    return false;
  }

  //kiểm tra số lượng ký tự ít nhất 6 -  max 10 ký tự
  if (valPassWord.length < 6 || valPassWord.length > 10) {
    spanVal.innerHTML = "Password phải từ 6 đến 10 ký tự";
    return false;
  }

  // kiểm tra định dạng
  let regex = /[><?@+'`~^%&\*\[\]\{\}.!#|\\\"$';,:;=/\(\),\-\w\s+]*/;
  if (!regex.test(valPassWord)) {
    spanVal.innerHTML = "Mật khẩu không đúng định dạng";
    return false;
  }

  // nếu ng dùng nhập đúng thì trả về thẻ rỗng
  spanVal.innerHTML = "";
  return true;
}

//===== Hàm kiểm tra datePicker
function validDatePicker() {
  //B1 DOM lấy thông tin tên của người dùng từ trình duyệt
  let valDatePicker = DOM("#datepicker").value;

  // DOM tới thẻ in ra thông báo
  let spanVal = DOM("#tbNgay");
  spanVal.style.display = "block";

  // kiểm tra rỗng
  if (!valDatePicker) {
    spanVal.innerHTML = "Ngày làm  không được để trống";
    return false;
  }
  // kiểm tra định dạng
  let regex =
    /(?=\d)^(?:(?!(?:10\D(?:0?[5-9]|1[0-4])\D(?:1582))|(?:0?9\D(?:0?[3-9]|1[0-3])\D(?:1752)))((?:0?[13578]|1[02])|(?:0?[469]|11)(?!\/31)(?!-31)(?!\.31)|(?:0?2(?=.?(?:(?:29.(?!000[04]|(?:(?:1[^0-6]|[2468][^048]|[3579][^26])00))(?:(?:(?:\d\d)(?:[02468][048]|[13579][26])(?!\x20BC))|(?:00(?:42|3[0369]|2[147]|1[258]|09)\x20BC))))))|(?:0?2(?=.(?:(?:\d\D)|(?:[01]\d)|(?:2[0-8])))))([-.\/])(0?[1-9]|[12]\d|3[01])\2(?!0000)((?=(?:00(?:4[0-5]|[0-3]?\d)\x20BC)|(?:\d{4}(?!\x20BC)))\d{4}(?:\x20BC)?)(?:$|(?=\x20\d)\x20))?((?:(?:0?[1-9]|1[012])(?::[0-5]\d){0,2}(?:\x20[aApP][mM]))|(?:[01]\d|2[0-3])(?::[0-5]\d){1,2})?$/;
  if (!regex.test(valDatePicker)) {
    spanVal.innerHTML = "Ngày làm không đúng định dạng";
    return false;
  }

  // nếu ng dùng nhập đúng thì trả về thẻ rỗng
  spanVal.innerHTML = "";
  return true;
}

//=== Hàm kiểm tra salary(tiền lương)
function validSalary() {
  //tạo biến và DOM lấy dữ liệu ng dùng nhập vào
  let valSalary = DOM("#luongCB").value * 1;

  // DOM tới thẻ hiển thị ra trình duyệt nếu nhập sai
  let spanVal = DOM("#tbLuongCB");
  spanVal.style.display = "block";

  // kiểm tra rỗng
  if (!valSalary) {
    spanVal.innerHTML = "Mức lương không được để trống";
    return false;
  }

  // kiểm tra đúng số tiền nhập 1e6(1tr) - 20e6(20tr)
  if (valSalary < 1e6 || valSalary > 20e6) {
    spanVal.innerHTML = "Mức lương không đúng vui lòng nhập lại";
    return false;
  }

  // nếu ng dùng nhập đúng thì trả về thẻ rỗng
  spanVal.innerHTML = "";
  return true;
}

//============= Hàm kiểm tra chức vụ
function validPosition() {
  //tạo biến và DOM lấy dữ liệu ng dùng nhập vào
  let valPosition = DOM("#chucvu").value;

  // DOM tới thẻ hiển thị ra trình duyệt nếu nhập sai
  let spanVal = DOM("#tbChucVu");
  spanVal.style.display = "block";

  // kiểm tra chọn
  if (valPosition === "0") {
    spanVal.innerHTML = "Vui lòng chọn chức vụ";
    return false;
  }

  // nếu ng dùng chọn đúng thì trả về thẻ rỗng
  spanVal.innerHTML = "";
  return true;
}

// ================ Hàm kiểm tra số giờ làm
function validWorkTime() {
  //tạo biến và DOM lấy dữ liệu ng dùng nhập vào
  let valWorkTime = DOM("#gioLam").value * 1;

  // DOM tới thẻ hiển thị ra trình duyệt nếu nhập sai
  let spanVal = DOM("#tbGiolam");
  spanVal.style.display = "block";

  // kiểm tra rỗng
  if (!valWorkTime) {
    spanVal.innerHTML = "Giờ làm không được để trống";
    return false;
  }

  // kiểm tra nhập đúng lượng giờ min 80 -  max 200
  if (valWorkTime < 80 || valWorkTime > 200) {
    spanVal.innerHTML = "Giờ làm ít nhất 80h và cao nhất 200h";
    return false;
  }

  // nếu ng dùng chọn đúng thì trả về thẻ rỗng
  spanVal.innerHTML = "";
  return true;
}

//============  Hàm kiểm tra xem form có hợp lệ hay không, return true/false
function validateForm() {
  // đặt biến cờ hiệu luôn mặc định ban đầu xem như form hợp lệ
  let formValid = true;

  //khởi chạy tất cả valid rồi gán ngược lại cho biến formValid ( sử dụng dấu &)
  formValid =
    validID() &
    validName() &
    validEmail() &
    validPassWord() &
    validDatePicker() &
    validSalary() &
    validPosition() &
    validWorkTime();

  // khi khởi chạy hệ thống sẽ duyệt qua tất cả func , nếu true trả về 1 , nếu false trả về 0 , nhưng chỉ cần 1 trong những func có false thì nguyên dãy func đó sẽ trả về kết quả = 0  và gán giá trị về biến formValid

  // đặt điều kiện nếu có 1 hàm kiểm tra ng dùng nhập sai thì return false kết thúc hàm để ko cho phép chạy tiếp
  if (!formValid) {
    return false;
  }

  // nếu người dùng nhập đúng hết thì return true
  return true;
}
